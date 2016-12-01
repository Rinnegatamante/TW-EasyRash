app.controller('logoutController',
 ($rootScope, $scope, $http, $location) => {
   if (localStorage.getItem('id') && localStorage.getItem('token')) {
     localStorage.removeItem('id')
     localStorage.removeItem('token')
   }
   $http.post('/user/logout').then(res => {
     $location.path('/login')
     $rootScope.user = undefined
   })
 })
