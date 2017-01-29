var rew
app.controller('viewController',
($scope, $http, $routeParams, $sce) => {
  $scope.highlight = {
    active: false,
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
    if (!$scope.highlight.active) return
    if (rew && document.getElementById('rew_edit')) return
    rew = new Review('rew')
    console.log(rew)
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
    })
  }
  $scope.getdata()

  var Review = function (type) {
    // console.log(range)
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
    this.node_id = this.selection.anchorNode.parentNode.id,
    this.node = this.selection.anchorNode,
    this.old_nodeHTML = this.selection.anchorNode.parentElement.innerHTML,
    this.start = this.selection.anchorOffset,
    this.end = this.selection.focusOffset
    this.rangeCount = this.selection.rangeCount

    $scope.highlight.text = this.selection.toString()
    $scope.highlight.startOffset = this.start
    $scope.highlight.endOffset = this.end
    $scope.highlight.type = this.type
    $scope.highlight.rangeCount = this.selection.rangeCount

    if (this.selection.anchorNode.isSameNode(this.selection.focusNode)) {
      $scope.highlight.same = true
      var r = this.selection.getRangeAt(0)
      var span = document.createElement('rew')
      span.setAttribute('class', type + ' edit-' + type)
      span.id = 'rew_edit'
      r.surroundContents(span)
    } else {
      $scope.highlight.same = false
    }

    this.undo = function () {
      this.node.parentElement.innerHTML = this.old_nodeHTML
      $scope.highlight = {active: true}
    }

    // console.log('content', this.common)
  }
})

/* var Review = function (range) {
  console.log(selection)
  if (selection.isCollapsed) return {}
  if (selection.rangeCount == 1)
  { this.text = selection.toString() }
  this.anchor = selection.anchorNode.parentElement
  this.anchorText = selection.anchorNode.textContent
  this.focus = selection.focusNode.parentElement
  this.focusText = selection.focusNode.textContent
  this.anchorOffset = selection.anchorOffset
  this.focusOffset = selection.focusOffset

  if (this.anchor == this.focus) {
    this.anchor.innerHTML = this.anchor.innerHTML.slice(0, this.anchorOffset) + '<rew>' + this.anchor.innerHTML.slice(this.anchorOffset) + '</rew>'
  } else {
    this.anchor.innerHTML = this.anchorText.slice(0, this.anchorOffset) + '<rew>' + this.anchorText.slice(this.anchorOffset) + '</rew>'
  }

  console.log('content', this.anchorText)
} */
