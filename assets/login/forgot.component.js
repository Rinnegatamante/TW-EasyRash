app.controller('forgotController',
 ($rootScope, $scope, $http, $location) => {
   $scope.submit = function () {
     var data = {
       email: $scope.user.email,
     }
   
     $http.post('/user/reset/send', data)
   }
 })
