// Controller for selectconf template
app.controller('selectconfController', ($scope, $http, $routeParams, $location) => {
	// Check if the user is logged, instead redirect to welcome page
  $http.get('/user/getdata').then(res => {}, function errorCallback (response) {
    $location.path('/') // Redirect to welcome page if not logged
  })

	// searchConference function: search for a conference on the database
  if ($scope.user === undefined) $scope.user = {}
  $scope.user.field = ''
  $http.get('/conference/searchConference/' + $scope.user.field).then(res => {
    $scope.conferences = res.data.conferences
  })
})
