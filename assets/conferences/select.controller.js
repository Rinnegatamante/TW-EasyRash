// Controller for selectconf template
app.controller('selectconfController',($scope, $http, $routeParams, $location) => {
	
	// searchConference function: search for a conference on the database
	if ($scope.user === undefined) $scope.user = {}
	$scope.user.field = ''
	$http.post('/conference/searchConference', $scope.user).then(res => {
		$scope.conferences = res.data.conferences
	})
	
})