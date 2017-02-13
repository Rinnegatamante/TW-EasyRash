// Controller for newconf template
app.controller('newconfController',($scope, $http, $location) => {
	$scope.conf = {}
	
	// submit function, starts a new conference
	$scope.submit = function () {
		$http.post('/conference/create', $scope.conf).then(res => {
			$location.path('/conferences/' + res.data.conference.id + '/addreviewers')
		})
	}

})