app.controller('loginController',
 ($rootScope, $scope, $http, $location) => {
   var digest = (name, password) => {
     var ha1 = md5(name + '' + password) // digest password
     var ha2 = 'POST' + window.location.origin
     var d = new Date()
     var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
     return (md5(ha1 + nonce + ha2))
   }

   $scope.submit = function () {
     var data = {
       email: $scope.user.email,
       digest: digest($scope.user.email, $scope.user.password)
     }

     $http.post('/user/login', data).then(res => {
       $rootScope.user = res.data.user
       $rootScope.user['token'] = res.data.token

       $location.path('/home')
       if ($scope.remember) {
         localStorage.setItem('id', $rootScope.user.id)
         localStorage.setItem('token', res.data.token)
       } else {
         localStorage.removeItem('id')
         localStorage.removeItem('token')
       }
     })
   }
 })
