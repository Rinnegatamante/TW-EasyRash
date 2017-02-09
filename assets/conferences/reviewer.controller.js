app.controller('reviewerController',
 ($scope, $http, $routeParams, $location) => {
   $http.post('/user/getdata').then(res => {
     $scope.user = res.data.user
   })

   $scope.create = function () {
     $location.path('/conferences/create')
   }
 })