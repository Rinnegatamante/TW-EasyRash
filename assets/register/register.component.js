// Controller for register template
app.controller('registerController',($scope, $http, $location) => {
	$scope.user = {sex: 'Male'} // Setting default gender
	
	// Check if the user is logged, if so redirect to dashboard
	$http.post('/user/getdata').then(res => {
		$location.path('/home')
	});
	
	// submit function, insert new user data to the database
	$scope.submit = function () {
		if ($scope.user.password === $scope.user.password2) {
			$http.post('/user/register', $scope.user).then(res => {
				$location.path('/login')
			})
		} else {
			alertify.error('Password mismatches.')
		}
	}
	
})