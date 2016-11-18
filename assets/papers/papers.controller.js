app.controller('papersController',
 ($scope, $http, $routeParams, $location, FileUploader) => {
   var uploader = $scope.uploader = new FileUploader({
     url: '/file/create/'
   })

        // FILTERS

   uploader.filters.push({
     name: 'files',
     fn: function (item /* {File|FileLikeObject} */, options) {
       return this.queue.length < 10
     }
   })
 })
