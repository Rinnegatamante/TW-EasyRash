app.controller('logoutController',
 ($rootScope, $scope, $http, $location) => {
   if (localStorage.getItem('id') && localStorage.getItem('token')) {
     localStorage.removeItem('id')
     localStorage.removeItem('token')
   }
   $location.path('/login')
   location.reload()
 })
