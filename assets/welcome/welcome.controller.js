// Controller for welcome template
app.controller('welcomeController',($scope, $http, $routeParams, $location) => {
	
	// Check if an user is already logged
	$http.post('/user/getdata').then(res => {
		$location.path('/home') // Redirect to dashboard if logged
	});
	
})