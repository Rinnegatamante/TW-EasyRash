app.controller('viewController',
($scope, $http, $routeParams) => {
  $scope.highlighted = {
    text: ''
  }
  $scope.paper = {
    id: $routeParams.pid
  }

  $scope.select = () => {
    if (window.getSelection()) {
      $scope.highlighted.text = window.getSelection().toString()
      $scope.format['#FFEB3B'] = window.getSelection().toString()
    } else if (document.selection) {
      $scope.highlighted.text = document.selection.createRange().htmlText
    }
  }

  $scope.view = '<h3>Loading paper ...</h3>'
  $scope.getdata = () => {
    $http.get('/paper/' + $scope.paper.id).then(res => {
      console.info('PAPER:', res.data.paper)
      $scope.paper = res.data.paper
      $scope.view()
    })
  }
  $scope.view = () => {
    $http.get($scope.paper.file.url).then(res => {
      $scope.view = res.data
      $('#view').html($scope.view)
    })
  }
  $scope.getdata()
})
