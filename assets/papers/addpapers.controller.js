app.controller('addpapersController',
 ($scope, $http, $routeParams, $location) => {
   var cid = $routeParams.cid
   $scope.getdata = () => {
     $http.post('/user/getdata').then(res => {
       console.info('PAPER -user:', res.data.user)
       $scope.user = res.data.user
       $scope.files = res.data.user.files
     })
     $http.post('/user/getfiles').then(res => {
       console.info('PAPER -user:', res.data.files)
       $scope.files = res.data.files
     })
   }
   $scope.getdata()

   $scope.selectPaper = (fid, title) => {
     var r = confirm('You have select "' + title + '". Are you shure?')
     if (r == true) {
       $http.post('/conference/addpaper', {cid: cid, fid: fid}).then(res => {
         console.info('PAPER -paper:', res.data.paper)
         $scope.paper = res.data.paper
       })
     }
   }
 })
