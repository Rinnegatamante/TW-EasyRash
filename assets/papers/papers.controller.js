// Controller for papers template
app.controller('papersController',($scope, $http, $rootScope, $location) => {
	$scope.settings = false
	
	// Default enabled filters
	$scope.filter = {
		name: '',
		accepted: true,
		pending: true,
		rejected: true,
		orderBy: 'name'
	}
	
	// Get logged user data
	$scope.getdata = () => {
		$http.post('/user/getdata').then(res => {
			$scope.user = res.data.user
			for (i in $scope.user.papers) {
				$http.get('/paper/' + $scope.user.papers[i].id).then(res => {
					for (i in $scope.user.papers) {
						if ($scope.user.papers[i].id == res.data.paper.id){ $scope.user.papers[i] = res.data.paper }
					}
				})
			}
		},function errorCallback(response) {
			$location.path('/') // Redirect to welcome page if not logged
		});
	}
	$scope.getdata()
	
	// deletePaper function, deletes a paper
	$scope.deletePaper = (pid) => {
		if (!confirm('Are you sure?')) return
		$http.post('/paper/' + pid + '/delete').then(res => {
			for (i in $scope.user.papers) {
				if ($scope.user.papers[i].id == pid) $scope.user.papers.splice(i, 1)
			}
		})
	}
	
	// filterCheckBox function, used as Angular filter
	$scope.filterCheckBox = (paper) => {
		if ($scope.filter.accepted && paper.status == 1) return true
		if ($scope.filter.pending && paper.status == 0) return true
		if ($scope.filter.rejected && paper.status == 2) return true
		return false
	}
	
	// status function, returns a string reppresenting the paper status
	$scope.status = (status) => {
		switch (status) {
			case 0:
			return 'pending'
			break
		case 1:
			return 'accepted'
			break
		case 2:
			return 'rejected'
			break
		}
	}
	
})