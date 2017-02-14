// Controller for addreviewers template
app.controller('addreviewersController',($scope, $http, $location, $routeParams) => {
	
	// Check if the user is logged, instead redirect to welcome page
	$http.post('/user/getdata').then(res => {},function errorCallback(response) {
		$location.path('/') // Redirect to welcome page if not logged
	});
	
	// Get conference ID from URL
	$scope.conf = {
		id: $routeParams.cid
	}
	
	// Request conference data
	$http.post('/conference/getData', $scope.conf).then(res => {
		$scope.conf = res.data.conference
	})
	
	// Watch for search input status modifications
	$scope.$watch('user.field', function (newVal, oldVal) {
		if (newVal != oldVal) { // Modification detected, request a search by name
			$http.post('/user/searchByName', $scope.user).then(res => {
				$scope.users = res.data.users
			})
		}
	})
	
	// add function, adds a new reviewer to the conference
	$scope.add = function (id) {
		$scope.conf.add_id = id
		$http.post('/conference/addReviewer', $scope.conf).then(res => {
			$scope.conf = res.data.conference
		})
	}
	
	// delete function, removes a reviewer from the conference
	$scope.delete = function (id) {
		$scope.conf.delete_id = id
		$http.post('/conference/deleteReviewer', $scope.conf).then(res => {
			$scope.conf = res.data.conference
		})
	}
	
})
