// Controller for logout template
app.controller('logoutController',($rootScope, $scope, $http, $location) => {
	
	// Check if the user is not logged, if so redirect to login page
	$http.get('/user/getdata').then(res => {},function errorCallback(response) {
		$location.path('/login') // Redirect to welcome page if not logged
	});
	
	// If user used 'Remember me' option during login, we purge localStorage items
	if (localStorage.getItem('id') && localStorage.getItem('token')) {
		localStorage.removeItem('id')
		localStorage.removeItem('token')
	}
	
	// Requesting logout procedure to the server
	$http.post('/user/logout').then(res => {
		$location.path('/login') // Redirecting to login page
		$rootScope.user = undefined
	})
	
})