// Controller for reviewer template
app.controller('reviewController',($scope, $http, $routeParams, $location) => {
	var cid = $routeParams.cid // Get conference ID from URL
	if ($scope.paper === undefined) $scope.paper = {}
	if ($scope.conference === undefined) $scope.conference = {}
	$scope.conference.id = cid
	$scope.paper.field = '' // Used as input for the Angular filter for the search
	
	// Getting papers related to the conference
	$http.post('/conference/getPapers', $scope.conference).then(res => {
		$scope.papers = res.data.papers
	})
	
})