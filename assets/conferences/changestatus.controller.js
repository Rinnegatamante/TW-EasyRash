app.controller('changestatusController',
	($scope, $http, $location, $routeParams) => {
		$scope.conf = {id: $routeParams.cid}
		$http.post('/conference/getData', $scope.conf).then(res => {
			$scope.conf = res.data.conference
			$scope.conf.paperstate = '' + res.data.conference.status
			$http.post('/conference/papers', $scope.conf).then(res => {
				$scope.conf.papers = {
					pending: []
				}
				res.data.papers.forEach((el) => {
					if (el.status == 0 || el.status == 3) $scope.conf.papers.pending.push(el)
				})
			})
		})
		$scope.submit = function () {
			$http.post('/conference/create', $scope.conf).then(res => {
				$location.path('/conferences/' + res.data.conference.id + '/addchairs')
			})
		}
		$scope.setStatus = function () {
			$scope.req = {id: $scope.conf.id, state: $scope.conf.paperstate}
			$http.post('/conference/setStatus', $scope.req)
		}
		$scope.close = function () {
			$scope.req = {id: $scope.conf.id, state: 2}
			$http.post('/conference/setStatus', $scope.req)
		}
    }
)
