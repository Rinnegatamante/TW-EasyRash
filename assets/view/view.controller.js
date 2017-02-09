var rew
app.controller('viewController',
  ($scope, $http, $routeParams, $animateCss) => {
    $scope.highlight = {
      active: false,
      text: '',
      same: false,
      textarea: '',
      type: ''
    }
    $scope.rew = {
      sel: '',
      select: function (rwid) {
        console.log(rwid)
        $('.rew-sel').removeClass('rew-sel')
        $('li[data-rew=' + rwid + ']').addClass('rew-sel')
        $('rew[data-rew=' + rwid + ']').addClass('rew-sel')
      }
    }
    $scope.paper = {
      id: $routeParams.pid
    }

    $scope.select = () => {
      if (!$scope.highlight.active) return
      if (window.getSelection && window.getSelection().isCollapsed) return
      if (rew && document.getElementsByClassName('in_editing')) {
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

    $scope.view = '<h3>Loading paper ...</h3>'
    $scope.getdata = () => {
      $http.get('/paper/' + $scope.paper.id).then(res => {
        $scope.paper = res.data.paper
        $http.get('/paper/' + $scope.paper.id + '/reviews/').then(res => {
          $scope.reviews = res.data.reviews
        })
        $scope.view()
        $('#tooltip_content').click(function () { $scope.rew.select($scope.rew.sel) })
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
            $scope.rew.sel = $(helper.origin).attr('data-rew')
          },
          functionAfter: function (instance, helper) {
            $scope.rew.sel = ''
          }
        })
      })
    }
    $scope.lock = () => {
    }
    $scope.release = () => {
    }
    $scope.commit = () => {
      $('.in-editing').each(function (index) {
        $(this).removeClass('in-editing')
      })
      var data = {
        rew_id: rew.id,
        text: $scope.highlight.textarea,
        rush: document.getElementById('view').innerHTML
      }
      $http.post('/paper/' + $scope.paper.id + '/review/create', data).then(res => {
        $scope.highlight = {}
      })
    }
    $scope.getdata()

    var Review = function (type) {
      // console.log(range)
      this.applier
      this.id
      this.selection = (function () {
        if (window.getSelection) {
          return window.getSelection()
        } else if (document.getSelection) {
          return document.getSelection()
        } else if (document.selection) {
          return document.selection.createRange().text
        } else {
          return false
        }
      }())
      this.type = type
      this.modify = this.selection.getRangeAt(0).commonAncestorContainer.innerHTML

      this.undo = function () {
        this.applier.undoToSelection(view)
        this.applier.detach(view)
        $scope.highlight = {
          active: true
        }
      }

      this.newRewId = function () {
        var id = Math.floor(Math.random() * 65535) // 2bytes MaxIn
        if ($('rew [data-rew=' + id + ']').length > 0) { // already exist rew with same id
          return this.newRewId()
        }
        return id
      }

      var view = document.getElementById('view')
      this.id = this.newRewId()
      this.applier = rangy.createClassApplier('in-editing', {
        elementTagName: 'rew',
        elementAttributes: {
          'data-rew': this.id.toString(),
          'rel-rew': '',
          'data-tooltip-content': '#tooltip_content'
        },
        useExistingElements: false
      })
      this.applier.applyToSelection(view)

      $scope.highlight.text = this.selection.toString()
    }
  })
