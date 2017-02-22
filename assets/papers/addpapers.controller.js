// Controller for addpapers template
app.controller('addpapersController', ($scope, $http, $routeParams, $location, $rootScope, FileUploader) => {
  var cid = $routeParams.cid // Getting conference id from URL
  $scope.co_authors = []
  $scope.users = []

	// Get logged user data
  $scope.getdata = () => {
    $http.get('/user/getdata').then(res => {
      $scope.user = res.data.user
    }, function errorCallback (response) {
      $location.path('/') // Redirect to welcome page if not logged
    })
  }
  $scope.getdata()

	// Watching search field
  $scope.$watch('user.field', function (newVal, oldVal) {
    if (newVal != oldVal) { // Modification detected, executing an user research by name
      $http.get('/user/searchByName/' + $scope.user.field).then(res => {
        $scope.users = []
        for (var i in res.data.users) {
          if (res.data.users[i].id != $rootScope.user.id) {
            $scope.users.push(res.data.users)
          }
        }
      })
    }
  })

	// add function, adds an user as an author of the paper
  $scope.add = function (user) {
    $scope.co_authors.push(user)
  }

	// remove function, removes an user as an author of the paper
  $scope.remove = function (user) {
    for (i in $scope.co_authors) {
      if ($scope.co_authors[i].id == user.id) {
        $scope.co_authors.splice(i, 1)
      }
    }
  }

  var header = {}
  if ($rootScope.user && $rootScope.user.id) {
    header = {
      'www-authenticate': window.btoa($rootScope.user.id + ' ' + $rootScope.user.token)
    }
  } else {
    header = {
      'www-authenticate': window.btoa(localStorage.getItem('id') + ' ' + localStorage.getItem('token'))
    }
  }

  var uploader = $scope.uploader = new FileUploader({
    url: '/paper/create/',
    headers: header
  })

    // Angular filters, used for

  uploader.filters.push({
    name: 'file',
    fn: function (item /* {File|FileLikeObject} */, options) {
      if (!$scope.title) {
        alertify.log('Insert title, please...')
        document.getElementById('file-upload').value = ''
        return false
      }
      return (this.queue.length <= 1 && item.type == 'text/html')
    }
  })

  uploader.onSuccessItem = function (fileItem, response, status, headers) {
    $('.dialog .msg').html(fileItem._file.name + ' uploaded successfully!\n')
    $location.path('/papers')
  }
  uploader.onBeforeUploadItem = function (item) {
    alertify.alert('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw margin-bottom"></i>')
    var ids = []
    for (i in $scope.co_authors) {
      ids.push($scope.co_authors[i].id)
    }
    var formData = [{
      co_ids: ids
    }, {
      cid: cid
    }, {title: $scope.title}]
    item.formData = formData
  }
})
