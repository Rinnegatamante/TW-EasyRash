// Controller for managepapers template
app.controller('managepapersController',($scope, $http, $location, $routeParams) => {
	
	// Get conference ID from URL
	$scope.conf = {
		id: $routeParams.cid
	}
	
	// Request conference data
	$http.post('/conference/getData', $scope.conf).then(res => {
		$scope.conf = res.data.conference
		$scope.conf.paperstate = '' + res.data.conference.status
		
		// Request conference papers
		$http.post('/conference/papers', $scope.conf).then(res => {
			$scope.conf.papers = {
				accepted: [],
				pending: [],
				rejected: []
			}
			
			// Distinguishing papers in terms of their states
			res.data.papers.forEach((el) => {
				switch (el.status) {
					case 0:
						$scope.conf.papers.pending.push(el)
						break
					case 1:
						$scope.conf.papers.accepted.push(el)
						break
					case 2:
						$scope.conf.papers.rejected.push(el)
						break
					default:
						break
				}
			})
			
		})
		
    })
	
	// accept function, sets a paper to accepted state
	$scope.accept = function (id) {
		$http.post('/paper/' + id + '/accept').then(res => {
			for (i in $scope.conf.papers.pending) {
				if ($scope.conf.papers.pending[i].id == id) {
					$scope.conf.papers.accepted.push(res.data.paper)
					$scope.conf.papers.pending.splice(i, 1)
				}
			}
		})
	}
	
	// reject function, sets a paper to rejected state
	$scope.reject = function (id) {
		$http.post('/paper/' + id + '/reject').then(res => {
			for (i in $scope.conf.papers.pending) {
				if ($scope.conf.papers.pending[i].id == id) {
					$scope.conf.papers.rejected.push(res.data.paper)
					$scope.conf.papers.pending.splice(i, 1)
				}
			}
		})
	}
	
})