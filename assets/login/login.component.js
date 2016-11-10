app.controller('loginCotroller',
 ($scope, $http, $routeParams) => {
   var digest = (name, password) => {
     var ha1 = this.password // digest password
     var ha2 = 'POST' + window.location.href
     var d = new Date()
     var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
     return (md5(ha1 + nonce + ha2))
   }

   $scope.submit = function () {
     var data = {
       email: $scope.user.email,
       digest: digest($scope.user.email, $scope.user.password)
     }

     console.log(data)

     $http.post('/user/login', data).then(res => {
       console.log(res.data)
       console.log('res')
       console.log('res', res)
       $scope.res = res.data
     }, err => {
       console.log(err.data)
       console.log('res')
       console.log('res', err)
       $scope.res = err.data
     })
   }
 })
