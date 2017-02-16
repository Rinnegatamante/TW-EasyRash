// Controller for reset template
app.controller('resetController',($rootScope, $scope, $http, $location) => {
	
	// Check if the user is logged, if so redirect to dashboard
	$http.get('/user/getdata').then(res => {
		$location.path('/home')
	});
	
	// Getting reset token from URL
	var data = {
		tempToken: $location.search().t
	}
	
	// Requesting a password reset to the server
	$http.post('/user/reset/psw', data).then(res => {
		$location.path('/login') // Redirecting to login page
	})
	
})