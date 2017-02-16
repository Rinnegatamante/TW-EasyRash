// Controller for conference template
app.controller('conferenceController', ($scope, $http, $routeParams, $location) => {
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

		// Counting accepted papers
    $scope.conf.paperstate = '' + res.data.conference.status
    $http.get('/conference/'+$scope.conf.id+'/papers').then(res => {
      $scope.conf.papers = []
      res.data.papers.forEach((el) => {
        if (el.status == 1) $scope.conf.papers.push(el)
      })
    })
  })
})
