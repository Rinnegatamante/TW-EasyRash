app.controller('resetController',
 ($rootScope, $scope, $http, $location) => {
   console.log($location.search().t)
   var data = {
     tempToken: $location.search().t
   }

   $http.post('/user/reset/psw', data).then(res => {
     $location.path('/login')
   })
   
 })