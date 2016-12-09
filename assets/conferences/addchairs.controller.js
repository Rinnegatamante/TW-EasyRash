app.controller('addchairsController',
    ($scope, $http, $location, $routeParams) => {
	  $scope.conf = {id : $routeParams.cid}
	  $http.post('/conference/getData', $scope.conf).then(res => {
		$scope.conf = res.data.conference
	  })
      $scope.submit = function () {
        $http.post('/conference/create', $scope.conf).then(res => {
		  $location.path('/addchairs/' + res.data.conference.id)
		})
      }
	  $scope.$watch('user.field', function(newVal, oldVal) {
            if(newVal != oldVal) {
                $http.post('/user/searchByName', $scope.user).then(res => {
					$scope.users = res.data.users
				})  
            }
      });
	  $scope.add = function (id) {
		$scope.conf.add_id = id
		$http.post('/conference/addChair', $scope.conf).then(res => {
          $scope.conf = res.data.conference
        }) 
	  }
	  $scope.delete = function (id) {
		$scope.conf.delete_id = id
		$http.post('/conference/deleteChair', $scope.conf).then(res => {
          $scope.conf = res.data.conference
        }) 
	  }
    }
  )
