app.controller('selectconfController',
 ($scope, $http, $routeParams, $location) => {
	$scope.user.field = ''
	$http.post('/conference/searchConference', $scope.user).then(res => {
		$scope.conferences = res.data.conferences
	})
	$scope.search = function () {
        $http.post('/conference/searchConference', $scope.user).then(res => {
          $scope.conferences = res.data.conferences
        })  
      }
 })
