// Controller for logout template
app.controller('logoutController',($rootScope, $scope, $http, $location) => {
	
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