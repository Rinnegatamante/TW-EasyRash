app.controller('addauthorsController',
  ($scope, $http, $routeParams, $location, $rootScope, FileUploader) => {
    var pid = $routeParams.pid
    $scope.co_authors = []
    $scope.getdata = () => {
      $http.post('/user/getdata').then(res => {
        $scope.user = res.data.user
        $http.get('/paper/' + pid).then(res => {
          console.info('PAPER:', res.data.paper)
          $scope.paper = res.data.paper
          $scope.co_authors = res.data.paper.author
        })
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
      $http.post('/paper/' + pid + '/addauthor/' + user.id).then(res => {
        $scope.co_authors.push(user)
      })
    }
    $scope.remove = function (user) {
      $http.post('/paper/' + pid + '/removeauthor/' + user.id).then(res => {
        for (i in $scope.co_authors) {
          if ($scope.co_authors[i].id == user.id) {
            $scope.co_authors.splice(i, 1)
          }
        }
      })
    }
  })
