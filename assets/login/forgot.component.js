// Controller for forgot template
app.controller('forgotController',($rootScope, $scope, $http, $location) => {
	
	// Check if the user is logged, if so redirect to dashboard
	$http.post('/user/getdata').then(res => {
		$location.path('/home')
	});
	
	// submit function, sends a new request for a password recovery by email
	$scope.submit = function () {
		var data = {
			email: $scope.user.email,
		}
		$http.post('/user/reset/send', data)
	}
	
})