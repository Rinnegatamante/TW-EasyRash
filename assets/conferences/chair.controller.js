// Controller for chair template
app.controller('chairController',($scope, $http, $routeParams, $location) => {
	
	// Request logged user data
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
	})
	
	// create function, starts a new conference
	$scope.create = function () {
		$location.path('/conferences/create')
	}
	
})