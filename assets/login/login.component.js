app.controller('loginController',
 ($rootScope, $scope, $http, $routeParams, $location) => {
   { var digest = (name, password) => {
     var ha1 = md5(name + '' + password) // digest password
     var ha2 = 'POST' + window.location.origin
     var d = new Date()
     var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
     return (md5(ha1 + nonce + ha2))
   } }

   $scope.submit = function () {
     var data = {
       email: $scope.user.email,
       digest: digest($scope.user.email, $scope.user.password)
     }
     console.log($rootScope)
     $http.post('/user/login', data).then(res => {
       $rootScope.user = res.data.user

       $location.path('/home')
       console.log(res.data.token)
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
