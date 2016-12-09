app.controller('changestatusController',
    ($scope, $http, $location, $routeParams) => {
	  $scope.conf = {id : $routeParams.cid}
	  $http.post('/conference/getData', $scope.conf).then(res => {
		$scope.conf = res.data.conference
	    $scope.conf.paperstate = '' + res.data.conference.status
		$http.post('/conference/getPendingPapers', $scope.conf).then(res => {
			$scope.conf.pending = res.data.papers
			$scope.conf.numpending = res.data.length
		})
	  })
	  $scope.submit = function () {
        $http.post('/conference/create', $scope.conf).then(res => {
		  $location.path('/conferences/' + res.data.conference.id + '/addchairs')
		})
      }
	  $scope.setStatus = function () {
	    $scope.req = {id : $scope.conf.id, state: $scope.conf.paperstate}
	    $http.post('/conference/setStatus', $scope.req)
	  }
	  $scope.close = function () {
	    $scope.req = {id : $scope.conf.id, state: 2}
	    $http.post('/conference/setStatus', $scope.req)
	  }
    }
  )
