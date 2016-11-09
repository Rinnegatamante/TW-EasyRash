app.controller('registerController',
    ($scope, $http) => {
      var digest = () => {}
      /* $http.get('/register').then(res => {
        $scope.page = res.data
      }) */
      $scope.submit = function () {
        if ($scope.user.password === $scope.user.password2) {
          $scope.res = 'form inviato'
        } else {
          $scope.res = 'password non coincidono'
        }
      }
    }
  )
