app.controller('addpapersController',
  ($scope, $http, $routeParams, $location, $rootScope, FileUploader) => {
    var cid = $routeParams.cid
    $scope.co_authors = []
    $scope.getdata = () => {
      $http.post('/user/getdata').then(res => {
        console.info('PAPER -user:', res.data.user)
        $scope.user = res.data.user
      })
    }
    $scope.getdata()

    $scope.$watch('user.field', function (newVal, oldVal) {
      if (newVal != oldVal) {
        $http.post('/user/searchByName', $scope.user).then(res => {
          $scope.users = res.data.users
        })
      }
    })

    $scope.add = function (user) {
      $scope.co_authors.push(user)
    }
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

    // FILTERS

    uploader.filters.push({
      name: 'file',
      fn: function (item /* {File|FileLikeObject} */, options) {
        return this.queue.length <= 1
      }
    })

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      $('.dialog .msg').html(fileItem._file.name + ' was upload successfully\n')
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
      }]
      item.formData = formData
    }
  })
