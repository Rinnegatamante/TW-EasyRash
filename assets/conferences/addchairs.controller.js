app.controller('addchairsController',
    ($scope, $http, $location, $routeParams) => {
	  $scope.conf = {id : $routeParams.id}
	  $http.post('/conference/getData', $scope.conf).then(res => {
		$scope.conf = res.data.conference
	  })
      $scope.submit = function () {
        $http.post('/conference/create', $scope.conf).then(res => {
		  $location.path('/addchairs/' + res.data.conference.id)
		})
      }
	  $scope.search = function () {
        $http.post('/user/searchByName', $scope.user).then(res => {
          $scope.users = res.data.users
        })  
      }
    }
  )
