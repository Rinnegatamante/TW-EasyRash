app.controller('addreviewersController',
  ($scope, $http, $location, $routeParams) => {
    $scope.conf = {
      id: $routeParams.cid
    }
    $http.post('/conference/getData', $scope.conf).then(res => {
      $scope.conf = res.data.conference
    })
    $scope.$watch('user.field', function (newVal, oldVal) {
      if (newVal != oldVal) {
        $http.post('/user/searchByName', $scope.user).then(res => {
          $scope.users = res.data.users
        })
      }
    })
    $scope.add = function (id) {
      $scope.conf.add_id = id
      $http.post('/conference/addReviewer', $scope.conf).then(res => {
        $scope.conf = res.data.conference
      })
    }
    $scope.delete = function (id) {
      $scope.conf.delete_id = id
      $http.post('/conference/deleteReviewer', $scope.conf).then(res => {
        $scope.conf = res.data.conference
      })
    }
  }
)
