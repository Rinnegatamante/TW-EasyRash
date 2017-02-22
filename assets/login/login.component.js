// Controller for login template
app.controller('loginController', ($rootScope, $scope, $http, $location) => {
	// Check if the user is logged, if so redirect to dashboard
  $http.get('/user/getdata').then(res => {
    $location.path('/home')
  })

	// digest function, calculate digest data for password encyption
  var digest = (name, password) => {
    var ha1 = md5(name.toString() + password.toString()) // digest password
    return (md5(ha1))
  }

	// submit function, execute an user login
  $scope.submit = function () {
    var data = {
      email: $scope.user.email,
      digest: digest($scope.user.email, $scope.user.password) // calculating digest
    }

		// Login request to the server
    $http.post('/user/login', data).then(res => {
      $rootScope.user = res.data.user
      $rootScope.user['token'] = res.data.token

      $location.path('/home')
      if ($scope.remember) { // If remember me is selected we save id and token to localStorage
        localStorage.setItem('id', $rootScope.user.id)
        localStorage.setItem('token', res.data.token)
      } else {
        localStorage.removeItem('id')
        localStorage.removeItem('token')
      }
    })
  }
})
