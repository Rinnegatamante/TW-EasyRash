app.controller('selectconfController',
 ($scope, $http, $routeParams, $location) => {
	if ($scope.user === undefined) $scope.user = {}
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
