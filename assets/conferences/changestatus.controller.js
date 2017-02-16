// Controller for changestatus template
app.controller('changestatusController', ($scope, $http, $location, $routeParams) => {
	// Check if the user is logged, instead redirect to welcome page
  $http.get('/user/getdata').then(res => {}, function errorCallback (response) {
    $location.path('/') // Redirect to welcome page if not logged
  })

	// Get conference ID from URL
  $scope.conf = {
    id: $routeParams.cid
  }

	// Request conference data
  $http.get('/conference/' + $scope.conf.id + '/getData').then(res => {
    $scope.conf = res.data.conference

		// Counting pending papers
    $scope.conf.paperstate = '' + res.data.conference.status
    $http.get('/conference/'+$scope.conf.id+'/papers').then(res => {
      $scope.conf.pending_papers = []
      res.data.papers.forEach((el) => {
        if (el.status == 0) $scope.conf.pending_papers.push(el)
      })
    })
  })

	// setStatus function, opens/closes conference to new papers submission
  $scope.setStatus = function () {
    $scope.req = {
      id: $scope.conf.id,
      state: $scope.conf.paperstate
    }
    $http.post('/conference/setStatus', $scope.req)
  }

	// close function, closes a conference
  $scope.close = function () {
    $scope.req = {
      id: $scope.conf.id,
      state: 2
    }
    $http.post('/conference/setStatus', $scope.req)
    $scope.conf.paperstate = 2
  }
})
