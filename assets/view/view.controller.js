var rew
app.controller('viewController',
  ($scope, $http, $routeParams, $animateCss) => {
    $scope.highlight = {
      active: true,
      text: '',
      same: false,
      startOffset: 0,
      endOffset: 0,
      rangeCount: 0,
      type: ''
    }
    $scope.paper = {
      id: $routeParams.pid
    }

    $scope.select = () => {
      console.log(window.getSelection())
      if (!$scope.highlight.active) return
      if (rew && document.getElementsByClassName('in_editing')) {
        $('#restart_rew').addClass('pulse')
        setTimeout(() => {
          $('#restart_rew').removeClass('pulse')
        }, 300)
        return
      }
      rew = new Review('rew')
    }

    $scope.undo_rew = () => {
      if (!$scope.highlight.active) return
      if (rew) {
        rew.undo()
        rew = undefined
      }
    }

    $scope.view = '<h3>Loading paper ...</h3>'
    $scope.getdata = () => {
      $http.get('/paper/' + $scope.paper.id).then(res => {
        $scope.paper = res.data.paper
        $scope.view()
      })
    }
    $scope.view = () => {
      $http.get($scope.paper.url).then(res => {
        $scope.view = res.data
        $('#view').html($scope.view)
        $('rew').tooltipster({
          animation: 'fade',
          interactive: true,
          delay: 200,
          side: 'bottom',
          theme: 'tooltipster-easyrush',
          contentAsHTML: true,
          contentCloning: true
        })
      })
    }
    $scope.getdata()

    var Review = function (type) {
      // console.log(range)
      var applier
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
      if (!this.selection || this.selection.isCollapsed) return false
      this.type = type

      this.undo = function () {
        applier.undoToSelection(view)
        applier.detach(view)
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
      var id = this.newRewId()
      applier = rangy.createClassApplier('in-editing', {
        elementTagName: 'rew',
        elementAttributes: {
          'data-rew': id.toString(),
          'rel-rew': '',
          'data-tooltip-content': '#tooltip_content'
        },
        useExistingElements: false
      }).applyToSelection(view)
    }
  })
