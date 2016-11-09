app.controller('registerController',
    ($scope, $http) => {
      $scope.submit = function () {
        if ($scope.user.password === $scope.user.password2) {
          $http.post('/user/register',$scope.user).then(res => {
		     console.log(res)
	      })
        } else {
          alertError("Passwords mismatches.")
        }
      }
    }
  )
