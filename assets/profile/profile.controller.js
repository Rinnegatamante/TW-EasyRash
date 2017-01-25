app.controller('profileController', ($scope, $http, $routeParams, $location) => {
	var digest = (name, password) => {
     var ha1 = md5(name + '' + password) // digest password
     var ha2 = 'POST' + window.location.origin
     var d = new Date()
     var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
     return (md5(ha1 + nonce + ha2))
   }
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
		$scope.user.oldemail = res.data.user.email
	})
	$scope.submit = function () {
		$scope.user.olddigest = digest($scope.user.oldemail, $scope.user.oldpassword)
		if ($scope.user.newpassword === $scope.user.newpassword2) {
			$http.post('/user/updatedata', $scope.user)
		} else {
			alertify.error('Password mismatches.')
		}
	}
})