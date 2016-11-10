app.controller('registerController',
    ($scope, $http, $location) => {
      $scope.submit = function () {
        if ($scope.user.password === $scope.user.password2) {
          $http.post('/user/register', $scope.user).then(res => {
            $location.path('/login')
	       })
        } else {
          alertify.error('Passwords mismatches.')
        }
      }
    }
  )
