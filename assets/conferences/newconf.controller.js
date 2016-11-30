app.controller('newconfController',
    ($scope, $http, $location) => {
	  $scope.conf = {}
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
