// Controller for assignto template
app.controller('assigntoController',($scope, $http, $routeParams, $location) => {
	
	$http.post('/user/getdata').then(res => {},function errorCallback(response) {
		$location.path('/') // Redirect to welcome page if not logged
	});
	
	var uid = $routeParams.uid // Getting user ID from URL
	var cid = $routeParams.cid // Getting conference ID from URL
	if ($scope.paper === undefined) $scope.paper = {}
	if ($scope.conference === undefined) $scope.conference = {}
	$scope.conference.id = cid
	$scope.paper.field = '' // field is used as Angular filter input
	
	// Getting conference's papers
	$http.post('/conference/getPapers', $scope.conference).then(res => {
		$scope.papers = res.data.papers
	})
	
	// assign function, assigns a paper to the selected user
	$scope.assign = function (id) {
		$http.post('/paper/' + id + '/addreviewer/' + uid).then(res => {
			$location.path('/conference/' + cid)
		})
	}
	
})