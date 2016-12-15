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
       $http.post('/user/getpapers').then(res => {
         console.info('PAPER -user:', res.data.papers)
         console.log($scope.files)
         for (var i = 0; $scope.files[i]; i++) {
           $scope.files[i].papers = []
           var findpaper = res.data.papers.forEach((papers) => {
             if (papers.file.id == $scope.files[i].id) {
               $scope.files[i].papers.push(papers)
             }
             return
           })
           console.log($scope.files[i], findpaper)
         }
       })
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
