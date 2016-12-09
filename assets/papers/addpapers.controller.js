app.controller('addpapersController',
 ($scope, $http, $routeParams, $location) => {
   var pid = $routeParams.pid
   $scope.getdata = () => {
     $http.post('/user/getdata').then(res => {
       console.info('PAPER -user:', res.data.user)
       $scope.user = res.data.user
       $scope.files = res.data.user.files
     })
   }
   $scope.getdata()
 })
