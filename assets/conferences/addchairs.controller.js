// Controller for addchairs template
app.controller('addchairsController',($scope, $http, $location, $routeParams) => {
	
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
	
	// add function, adds a new co-chair to the conference
	$scope.add = function (id) {
		$scope.conf.add_id = id
		$http.post('/conference/addChair', $scope.conf).then(res => {
			$scope.conf = res.data.conference
		})
	}
	
	// delete function, removes a co-chair from the conference
	$scope.delete = function (id) {
		$scope.conf.delete_id = id
		$http.post('/conference/deleteChair', $scope.conf).then(res => {
			$scope.conf = res.data.conference
		})
	}
})