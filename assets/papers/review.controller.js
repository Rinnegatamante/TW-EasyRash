app.controller('reviewController',
 ($scope, $http, $routeParams, $location) => {
	var cid = $routeParams.cid
	if ($scope.paper === undefined) $scope.paper = {}
	if ($scope.conference === undefined) $scope.conference = {}
	$scope.conference.id = cid
	$scope.paper.field = ''
	$http.post('/conference/getPapers', $scope.conference).then(res => {
		$scope.papers = res.data.papers
	})	
 })
