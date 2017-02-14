// Controller for chair template
app.controller('chairController',($scope, $http, $routeParams, $location) => {
	
	// Request logged user data
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
	},function errorCallback(response) {
		$location.path('/') // Redirect to welcome page if not logged
	});
	
	// create function, starts a new conference
	$scope.create = function () {
		$location.path('/conferences/create')
	}
	
})