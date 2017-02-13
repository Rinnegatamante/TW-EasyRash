// Controller for forgot template
app.controller('forgotController',($rootScope, $scope, $http, $location) => {
	
	// submit function, sends a new request for a password recovery by email
	$scope.submit = function () {
		var data = {
			email: $scope.user.email,
		}
		$http.post('/user/reset/send', data)
	}
	
})