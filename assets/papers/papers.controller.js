app.controller('papersController',
 ($scope, $http, $rootScope, $location, FileUploader) => {
   $scope.getdata = () => {
     $http.post('/user/getdata').then(res => {
       console.info('FILE -user:', res.data.user)
       $scope.user = res.data.user
       $scope.files = res.data.user.files
       $http.post('/user/getpapers').then(res => {
         console.info('PAPER -user:', res.data.papers)
         console.log($scope.files)
         for (var i = 0; $scope.files[i]; i++) {
           $scope.files[i].papers = []
           res.data.papers.forEach((paper) => {
             if (!paper.file) return false
             if (paper.file.id == $scope.files[i].id) {
               console.log($scope.files[i], paper)
               $scope.files[i].papers.push(paper)
             }
           })
         }
       })
     })
   }
   $scope.getdata()

   var header = {}

   if ($rootScope.user && $rootScope.user.id) {
     header = {'www-authenticate': window.btoa($rootScope.user.id + ' ' + $rootScope.user.token)}
   } else {
     header = {'www-authenticate': window.btoa(localStorage.getItem('id') + ' ' + localStorage.getItem('token'))}
   }

   var uploader = $scope.uploader = new FileUploader({
     url: '/file/create/',
     headers: header
   })

        // FILTERS

   uploader.filters.push({
     name: 'file',
     fn: function (item /* {File|FileLikeObject} */, options) {
       return this.queue.length < 10
     }
   })

   uploader.onCompleteItem = function (fileItem, response, status, headers) {
     $scope.getdata()
   }

   $scope.deletePaper = (pid) => {
   }
 })
