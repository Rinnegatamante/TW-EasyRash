// TODO json-ld

var rew
var Review
app.controller('viewController', ($scope, $http, $rootScope, $routeParams, $animateCss) => {
	// Check if the user is logged, instead redirect to welcome page
  $http.post('/user/getdata').then(res => {}, function errorCallback (response) {
    $location.path('/') // Redirect to welcome page if not logged
  })

  rangy.init()
  $scope.highlight = { // actual highlighted comment
    active: false,
    text: '',
    same: false,
    review: '',
    type: 'comment'
  }
  $scope.isaReviewer = false
  $scope.filter = { // visible comments
    see: 'All comments'
  }
  $scope.$watch('filter.see',
    function (newValue, oldValue) {
      $('rew').removeClass('highlight')
      switch (newValue) {
        case 'Main comments':
          $('rew.comment').addClass('highlight')
          break
        case 'Secondary comments':
          $('rew.secondary-comment').addClass('highlight')
          break
        case 'All comments':
          $('rew').addClass('highlight')
          break
      }
    })

  $scope.rews = [] //  local review
  $scope.watchReview = { // review focused
    sel: '',
    rew: {} // object of review's database

  }
  $scope.paper = {
    id: $routeParams.pid
  }

  $scope.focusReview = function (rwid) { // focus on selected review
    $('.rew-sel').removeClass('rew-sel')
    $('[data-rew=' + rwid + ']').addClass('rew-sel')
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
    rew = new Review('comment')
  }

  $scope.undo_rew = () => { // delete current review
    if (!$scope.highlight.active) return
    if (rew) {
      rew.undo()
      rew = false
    }
  }
  $scope.cancel_rew = (rid) => { // delete a review
    if (!$scope.highlight.active) return
    for (var i = 0; i < $scope.rews.length; i++) {
      if ($scope.rews[i].id == rid) {
        $scope.rews[i].undo()
        $scope.rews.splice(i, 1)
      }
    }
  }
  $scope.edit_rew = (rid) => {
    if (!$scope.highlight.active) return
    r = $scope.rews.find((el) => {
      return (el.id == rid)
    })
    if (!r) return
    rew = r
    $scope.cancel_rew(rid)
    $scope.highlight.review = r.review
    $scope.highlight.text = r.text
    $scope.highlight.type = r.type
  }
  $scope.read_rew = (rid) => { // red all review comment
    var txt = ''
    var flag = false
    var r = $scope.reviews.find((el) => {
      return (el.rew_id == rid)
    })
    if (!r) {
      r = $scope.rews.find((el) => {
        return (el.id == rid)
      })
      flag = true
    }
    if (!r) return
    txt = r.text
    if (flag) txt = r.review
    alertify.alert('<div id="read_rew">' + txt + '</div>')
    $('.alertify .dialog> div').css({
      minWidth: screen.width * 0.6 + 'px'
    })
  }

  $scope.add_rew = () => { // add review to local reviews
    if (!rew) alertify('Select first the text you want to comment and then insert the relative one')
    if (!$scope.highlight.active) return
    if (!$scope.highlight.type) return
    if (!$scope.highlight.review || $scope.highlight.review.length <= 0) return
    $('.in-editing').each(function (index) {
      $(this).removeClass('in-editing')
    })
    rew.setReview($scope.highlight.review)
    rew.setType($scope.highlight.type)
    $scope.rews.push(rew)

    $scope.highlight = {
      active: true,
      type: 'comment'
    }
  }

  $scope.getdata = () => { // get paper data
    $http.get('/paper/' + $scope.paper.id).then(res => {
      $scope.paper = res.data.paper
      $http.get('/paper/' + $scope.paper.id + '/reviews/').then(res => {  // get associated reviews
        $scope.reviews = res.data.reviews
      })
      $http.get('/paper/' + $scope.paper.id + '/imReviewer/').then(res => { // check if user can review this paper
        if (res.data.response == 1) $scope.isaReviewer = true
      })
      $scope.getview()
      $('#tooltip_content').click(function () {
        $scope.watchReview.select($scope.watchReview.sel)
      })
    })
  }
  $scope.getview = () => { // get paper content - RUSH
    $http.get($scope.paper.url).then(res => {
      $scope.view = res.data
      $('#view').html($scope.view)
      $('rew').tooltipster({ // tooltips
        animation: 'fade',
        interactive: true,
        delay: 400,
        minWidth: 300,
        maxWidth: 700,
        side: 'bottom',
        theme: 'tooltipster-easyrush',
        contentAsHTML: true,
        contentCloning: true,
        functionBefore: function (instance, helper) { // inner text of tooltip associated to selected review
          var id = $(helper.origin).attr('data-rew')
          var r = $scope.reviews.find((el) => {
            return (el.rew_id == id)
          })
          if (!r) return
          instance.content(`<span id="tooltip_content" class="row"><div class="col-sm-12 header">
						` + r.author.name + ` -
						<small class="button text-muted">` + r.author.createdAt.substr(0, 10) + `</small>
  						<i class="pull-right fa fa-file-text-o" onclick="read_rew(this,'` + r.rew_id + `')" style="cursor: pointer" aria-hidden="true" title="read all"></i>
						<i class="pull-right fa fa-lightbulb-o" onclick="focusReview(this, '` + r.rew_id + `')" title='view' style="cursor: pointer" title="highlight" aria-hidden="true"></i>
					</div>
					<hr/>
					<div class="col-sm-12 content">
					` + $scope.summaryText(r.text, 500) + `
					</div></span>`)
        },
        functionAfter: function (instance, helper) {
          $scope.watchReview.sel = ''
        }
      })
    })
  }

  $scope.getEpub = () => { // download the epub verison
    $http.get('/paper/' + $scope.paper.id + '/epub').then(res => {
      if (res.data.path) {
        window.open(res.data.path)
      }
    })
  }
  $scope.lock = (cb) => { // request the access to paper
    $scope.getdata()
    $http.get('/paper/' + $scope.paper.id + '/lock').then(res => {
      if (res.data.s_token) {
        $scope.highlight.active = true
        $scope.s_token = res.data.s_token
        if (cb) cb($scope.s_token)
      }
    })
  }
  $scope.free = () => { // set free access to the paper
    $http.get('/paper/' + $scope.paper.id + '/free/' + $scope.s_token).then(res => {
      $scope.highlight.active = false
      $scope.rews = []
    })
  }

  $scope.commit = () => { // upload all requests
    if ($scope.highlight.text) return
    alertify
  .okBtn('Accept')
  .cancelBtn('Reject')
  .confirm('What is your opinion about this paper?', function (ev) {
    ev.preventDefault()
    $('.in-editing').removeClass('in-editing')
    $('.rew-sel').removeClass('rew-sel')
    loadReviewsJSONLD($scope.rews, $scope.paper, $rootScope.user, $scope.status)

    var data = {
      token: '', // token,
      rew_id: [],
      type: [],
      text: [],
      status: 1,
      rush: document.getElementById('view').innerHTML
    }
    for (var i = 0; i < $scope.rews.length; i++) {
      data.rew_id.push($scope.rews[i].id)
      data.text.push($scope.rews[i].review)
      data.type.push($scope.rews[i].type)
    }
    $http.post('/paper/' + $scope.paper.id + '/review/create', data).then(res => {
      $scope.highlight.active = false
      $scope.rews = []
      $scope.free()
    })
  }, function (ev) {
    ev.preventDefault()
    $('.in-editing').removeClass('in-editing')
    $('.rew-sel').removeClass('rew-sel')
    loadReviewsJSONLD($scope.rews, $scope.paper, $rootScope.user, $scope.status)

    var data = {
      token: '', // token,
      rew_id: [],
      type: [],
      text: [],
      status: 2,
      rush: document.getElementById('view').innerHTML
    }
    for (var i = 0; i < $scope.rews.length; i++) {
      data.rew_id.push($scope.rews[i].id)
      data.text.push($scope.rews[i].review)
      data.type.push($scope.rews[i].type)
    }
    $http.post('/paper/' + $scope.paper.id + '/review/create', data).then(res => {
      $scope.highlight.active = false
      $scope.rews = []
      $scope.free()
    })
  })
  }
  $scope.getdata()

  Review = function (type) { // object of local review
    var view = document.getElementById('view')

    this.newRewId = function () { // calculate review id
      var id = '#' + Math.floor(Math.random() * 65535) // 2bytes MaxIn
      if ($('rew [data-rew=' + id + ']').length > 0) { // already exist rew with same id
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
    this.highlighter.addClassApplier(rangy.createClassApplier('highlight', {
      elementTagName: 'rew',
      elementProperties: {
        'className': 'in-editing'
      },
      elementAttributes: {
        'data-rew': this.id,
        'rel-rew': '',
        'data-auth': $rootScope.user.id,
        'data-tooltip-content': '#tooltip_content'
      },
      useExistingElements: false
    }))

    this.highlighter.highlightSelection('highlight')
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
    this.restore = function (obj) { // restore object review from localStorage
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
    this.setType = function (type) {
      if (this.type) $('[data-rew=' + this.id + ']').removeClass(this.type)
      this.type = type
      $('[data-rew=' + this.id + ']').addClass(this.type)
    }

    this.undo = function () { // delete this review and highlight
      $('[data-rew=' + this.id + ']').addClass('in-editing')
      $('[data-rew=' + this.id + ']').removeClass(this.type)
      this.highlighter.removeAllHighlights()
      $scope.highlight = {
        active: true,
        type: 'comment'
      }
    }
  }
})

var saveLocalReview = (pid, rews) => { // save in localStorage the rews
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
  papers = JSON.parse(papers)

  var obj = []
  for (var i in papers) {
    if (i == pid) {
      var rews = papers[i].rews
      for (var i = 0; i < rews.length; i++) {
        var r = new Review()
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

var loadReviewsJSONLD = (reviews, paper, user, status) => { // insert into the paper json-ld information
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
    '@id': reviews[0].id,
    'article': {
      '@id': paper.id,
      'eval': {
        '@context': 'easyrash.json',
        '@id': '#review' + reviews[0].id + '-eval',
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
      '@id': '#role' + reviews[0].id,
      '@type': 'role',
      'role_type': 'pro:reviewer', // TODO
      'in': ''
    }
  }]

  var view = document.getElementById('view')
  var title = view.getElementsByTagName('title')[0]
  var script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.innerHTML = JSON.stringify(ld)
  title.parentNode.insertBefore(script, title.nextSibling)
}

function read_rew (el, rwid) {
  var scope = angular.element(document.getElementById('view')).scope()
  scope.read_rew(rwid)
}
function focusReview (el, rwid) {
  var scope = angular.element(document.getElementById('view')).scope()
  scope.focusReview(rwid)
}
