app.controller('newconfController',
    ($scope, $http, $location) => {
	  $scope.conf = {}
      $scope.submit = function () {
        $http.post('/conference/create', $scope.conf).then(res => {
		  $location.path('/conferences/' + res.data.conference.id + '/addreviewers')
		})
      }
	  $scope.search = function () {
        $http.post('/user/searchByName', $scope.user).then(res => {
          $scope.users = res.data.users
        })
      }
    }
  )
