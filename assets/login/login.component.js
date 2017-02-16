// Controller for login template
app.controller('loginController',($rootScope, $scope, $http, $location) => {
	
	// Check if the user is logged, if so redirect to dashboard
	$http.get('/user/getdata').then(res => {
		$location.path('/home')
	});
	
	// digest function, calculate digest data for password encyption
	var digest = (name, password) => {
		var ha1 = md5(name + '' + password) // digest password
		var ha2 = 'abcdabcd'
		var d = new Date()
		var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
		return (md5(ha1 + nonce + ha2))
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
