// Controller for reviewer template
app.controller('reviewController',($scope, $http, $routeParams, $location) => {
	
	var cid = $routeParams.cid // Get conference ID from URL
	if ($scope.paper === undefined) $scope.paper = {}
	if ($scope.conference === undefined) $scope.conference = {}
	$scope.conference.id = cid
	$scope.paper.field = '' // Used as input for the Angular filter for the search
	
	// Get logged user data
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
	},function errorCallback(response) {
		$location.path('/') // Redirect to welcome page if not logged
	});
	
	// Getting papers related to the conference
	$http.post('/conference/getPapers', $scope.conference).then(res => {
		$scope.papers = []
		
		// Removing already reviewed papers
		for (i=0;i<res.data.papers.length;i++){
			var reviewed = false
			for (z=0;z<$scope.user.reviews.length;z++){
				if (res.data.papers[i].id == $scope.user.reviews[z].paper){
					reviewed = true
					break
				}
			}
			if (!reviewed){
				$scope.papers.push(res.data.papers[i]);
			}
		}
		
	})
	
})