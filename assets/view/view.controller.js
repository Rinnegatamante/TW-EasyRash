var rew
var Review
app.controller('viewController',
  ($scope, $http, $rootScope, $routeParams, $animateCss) => {
    rangy.init()
    $scope.highlight = {
      active: false,
      text: '',
      same: false,
      review: '',
      type: ''
    }
    $scope.rews = []
    $scope.watchReview = {
      sel: '',
      select: function (rwid) {
        $('.rew-sel').removeClass('rew-sel')
        $('[data-rew=#' + rwid + ']').addClass('rew-sel')
      }
    }
    $scope.paper = {
      id: $routeParams.pid
    }

    $scope.summaryText = (text, max) => {
      if (!text || text.length == 0) return ''
      var limit = parseInt(max / 2) - 4
      if (text.length > max) {
        return text.substr(0, limit) + ' [...] ' + text.substr(text.length - limit, text.length)
      }
      return text
    }

    $scope.select = () => {
      if (!$scope.highlight.active) return
      if (window.getSelection && window.getSelection().isCollapsed) return
      if (document.getElementsByClassName('in-editing').length > 0) {
        $('#restart_rew').addClass('pulse')
        setTimeout(() => {
          $('#restart_rew').removeClass('pulse')
        }, 300)
        return
      }
      rew = new Review('rew')
      console.log(rew)
    }

    $scope.undo_rew = () => {
      if (!$scope.highlight.active) return
      if (rew) {
        rew.undo()
        rew = false
      }
    }
    $scope.cancel_rew = (rid) => {
      if (!$scope.highlight.active) return
      for (var i = 0; i < $scope.rews.length; i++) {
        if ($scope.rews[i].id == rid) $scope.rews.splice(i, 1)
      }
      saveLocalReview($scope.paper.id, $scope.rews)
      $scope.view()
    }

    $scope.add_rew = () => {
      if (!$scope.highlight.active) return
      if (!$scope.highlight.review || $scope.highlight.review.length <= 0) return
      $('.in-editing').each(function (index) {
        $(this).removeClass('in-editing')
      })
      rew.setReview($scope.highlight.review)
      $scope.rews.push(rew)
      console.log($scope.rews)
      saveLocalReview($scope.paper.id, $scope.rews)

      $scope.highlight = {
        active: true
      }
    }

    $scope.view = '<h3>Loading paper ...</h3>'
    $scope.getdata = () => {
      $http.get('/paper/' + $scope.paper.id).then(res => {
        $scope.paper = res.data.paper
        $http.get('/paper/' + $scope.paper.id + '/reviews/').then(res => {
          $scope.reviews = res.data.reviews
        })
        $scope.view()
        $('#tooltip_content').click(function () {
          $scope.watchReview.select($scope.watchReview.sel)
        })
      })
    }
    $scope.view = () => {
      $http.get($scope.paper.url).then(res => {
        $scope.view = res.data
        $('#view').html($scope.view)
        $('rew').tooltipster({
          animation: 'fade',
          interactive: true,
          delay: 400,
          side: 'bottom',
          theme: 'tooltipster-easyrush',
          contentAsHTML: true,
          contentCloning: true,
          functionBefore: function (instance, helper) {
            $scope.watchReview.sel = $(helper.origin).attr('data-rew')
          },
          functionAfter: function (instance, helper) {
            $scope.watchReview.sel = ''
          }
        })
        restoreLocalReview($scope.paper.id, (rews) => {
          console.log(rews)
          $scope.rews = rews
        })
      })
    }
    $scope.lock = (cb) => {
      $http.get('/paper/' + $scope.paper.id + '/lock').then(res => {
        if (res.data.s_token) {
          $scope.highlight.active = true
          $scope.paper.s_token = res.data.s_token
          if (cb) cb($scope.paper.s_token)
        }
      })
    }
    $scope.free = () => {
      $http.get('/paper/' + $scope.paper.id + '/free/' + $scope.paper.s_token).then(res => {
        $scope.highlight.active = false
      })
    }

    $scope.commit = () => {
      $('.in-editing').removeClass('in-editing')
      $('.rew-sel').removeClass('rew-sel')

      /* $scope.lock((token) => { */
      var data = {
        token: '', // token,
        rew_id: [],
        text: [],
        rush: document.getElementById('view').innerHTML
      }
      for (var i = 0; i < $scope.rews.length; i++) {
        data.rew_id.push($scope.rews[i].id)
        data.text.push($scope.rews[i].review)
      }
      $http.post('/paper/' + $scope.paper.id + '/review/create', data).then(res => {
        $scope.highlight = {}
        loadReviewsJSONLD($scope.rews, $scope.paper, $rootScope.user, $scope.status)
        $scope.rews = []
        saveLocalReview($scope.paper.id, [])
        $scope.free()
        $scope.getdata()
      })
        //  })
    }
    $scope.getdata()

    Review = function (type) {
      // console.log(range)
      var view = document.getElementById('view')

      this.newRewId = function () {
        var id = Math.floor(Math.random() * 65535) // 2bytes MaxIn
        if ($('rew [data-rew=#' + id + ']').length > 0) { // already exist rew with same id
          return this.newRewId()
        }
        return id
      }

      this.selection = (function () {
        if (window.getSelection) {
          return window.getSelection()
        } else if (document.getSelection) {
          return document.getSelection()
        } else if (document.selection) {
          return document.selection.createRange().text
        }
      }())
      this.review = ''
      this.type = type
      this.id = this.newRewId()
      this.highlighter = rangy.createHighlighter()
      this.highlighter.addClassApplier(rangy.createClassApplier('in-editing', {
        elementTagName: 'rew',
        elementAttributes: {
          'data-rew': '#' + this.id.toString(),
          'rel-rew': '',
          'data-auth': $rootScope.user.id,
          'data-tooltip-content': '#tooltip_content'
        },
        useExistingElements: false
      }))

      this.highlighter.highlightSelection('in-editing')
      this.serialized = this.highlighter.serialize()

      this.text = this.selection.toString()

      $scope.highlight.text = this.text

      this.toObject = function () {
        var obj = {
          id: this.id,
          text: this.text,
          review: this.review,
          type: this.type,
          serialized: this.serialized
        }
        return obj
      }
      this.restore = function (obj) {
        if (!obj) return
        if (typeof obj === 'string') obj = JSON.parse(obj)
        this.id = obj.id
        this.text = obj.text
        this.review = obj.review
        this.type = obj.type
        this.serialized = obj.serialized
        this.highlighter.deserialize(this.serialized)
        return this
      }

      this.setReview = function (text) {
        this.review = text
      }

      this.undo = function () {
        // rangy.restoreSelection(this.selection)
        // this.applier.undoToSelection(view)
        // this.applier.detach(view)
        $scope.highlight = {
          active: true
        }
      }
    }
  })

var saveLocalReview = (pid, rews) => {
  console.log(rews)
  var obj = []
  for (var i = 0; i < rews.length; i++) {
    obj.push(rews[i].toObject())
  }
  var p = localStorage.getItem('localRews')
  if (!p) {
    p = {}
    p[pid] = {
      rews: obj
    }
  } else {
    p = JSON.parse(p)
    p[pid] = {}
    p[pid].rews = obj
  }
  localStorage.setItem('localRews', JSON.stringify(p))
}
var restoreLocalReview = (pid, cb) => { // save in rews the reviews array restored from localStorage
  var papers = localStorage.getItem('localRews')
  if (!papers) return
  console.log(papers)
  papers = JSON.parse(papers)
  console.log(papers)

  var obj = []
  for (var i in papers) {
    console.log(papers[i])
    if (i == pid) {
      var rews = papers[i].rews
      console.log(papers[i])
      for (var i = 0; i < rews.length; i++) {
        var r = new Review()
        console.log(rews[i])
        r.restore(rews[i])
        obj.push(r)
      }
    }
  }
  $('.in-editing').each(function (index) {
    $(this).removeClass('in-editing')
  })
  cb(obj)
}

var loadReviewsJSONLD = (rewiews, paper, auth, status) => {
  var comments = []
  var rews = []
  var date = new Date()
  for (var i = 0; i < reviews.length; i++) {
    comments.push(reviews[i].id)
    rews.push({
      '@context': 'easyrash.json',
      '@type': 'comment',
      '@id': reviews[i].id,
      'text': reviews[i],
      'ref': '[data-rew=' + reviews[i].id + ']',
      'author': user.email,
      'date': date.toUTCString()
    })
  }
  var ld = [{
    '@context': 'easyrash.json',
    '@type': 'review',
    '@id': review.id,
    'article': {
      '@id': paper.id,
      'eval': {
        '@context': 'easyrash.json',
        '@id': '#review' + rews[0].id + '-eval',
        '@type': 'score',
        'status': 'pso:' + status,
        'author': 'mailto:' + paper.owner.email,
        'date': date.toUTCString()
      }
    },
    'comments': comments
  }, rews, {
    '@context': 'http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json',
    '@type': 'person',
    '@id': user.email,
    'name': user.name,
    'as': {
      '@id': '#role' + rews[0].id,
      '@type': 'role',
      'role_type': 'pro:reviewer', // TODO
      'in': ''
    }
  }]

  var view = document.getElementById('view')
  var title = document.getElementsByTagName('title')[0]
  var script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.innerHTML = JSON.stringify(ld)
  title.parentNode.insertBefore(script, title.nextSibling)
}
