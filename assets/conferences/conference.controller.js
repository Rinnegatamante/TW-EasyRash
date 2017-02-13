// Controller for conference template
app.controller('conferenceController',($scope, $http, $routeParams, $location) => {
	
	// Get conference ID from URL
	$scope.conf = {
		id: $routeParams.cid
	}
	
	// Request conference data
	$http.post('/conference/getData', $scope.conf).then(res => {
		$scope.conf = res.data.conference
		
		// Counting accepted papers
		$scope.conf.paperstate = '' + res.data.conference.status
		$http.post('/conference/papers', $scope.conf).then(res => {
			$scope.conf.papers = []
			res.data.papers.forEach((el) => {
				if (el.status == 1) $scope.conf.papers.push(el)
			})
		})
	})

})