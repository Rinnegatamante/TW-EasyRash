app.controller('papersController',
 ($scope, $http, $rootScope, $location, FileUploader) => {
   $http.post('/user/getdata').then(res => {
     console.info('PAPER -user:', res.data.user)
     $scope.user = res.data.user
     $scope.files = res.data.user.files
   })

   var uploader = $scope.uploader = new FileUploader({
     url: '/file/create/',
     headers: {'www-authenticate': window.btoa($rootScope.user.id + ' ' + $rootScope.user.token)}
   })

        // FILTERS

   uploader.filters.push({
     name: 'file',
     fn: function (item /* {File|FileLikeObject} */, options) {
       return this.queue.length < 10
     }
   })
 })
