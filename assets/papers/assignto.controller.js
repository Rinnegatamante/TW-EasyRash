app.controller('assigntoController',
 ($scope, $http, $routeParams, $location) => {
	var uid = $routeParams.uid
	var cid = $routeParams.cid
	if ($scope.paper === undefined) $scope.paper = {}
	if ($scope.conference === undefined) $scope.conference = {}
	$scope.conference.id = cid
	$scope.paper.field = ''
	$http.post('/conference/getPapers', $scope.conference).then(res => {
		$scope.papers = res.data.papers
	})	
	$scope.assign = function (id) {
      $http.post('/paper/' + id + '/addreviewer/' + uid).then(res => {
        $location.path('/conference/' + cid)
      })
    }
 })
