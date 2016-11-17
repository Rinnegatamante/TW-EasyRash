app.controller('papersController',
 ($scope, $http, $routeParams, $location, FileUploader) => {
   var uploader = $scope.uploader = new FileUploader({
     url: 'upload.php'
   })

        // FILTERS

   uploader.filters.push({
     name: 'customFilter',
     fn: function (item /* {File|FileLikeObject} */, options) {
       return this.queue.length < 10
     }
   })
 })
