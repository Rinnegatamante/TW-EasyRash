app.controller('managepapersController',
  ($scope, $http, $location, $routeParams) => {
    $scope.conf = {
      id: $routeParams.cid
    }
    $http.post('/conference/getData', $scope.conf).then(res => {
      $scope.conf = res.data.conference
      $scope.conf.paperstate = '' + res.data.conference.status
      $http.post('/conference/papers', $scope.conf).then(res => {
        $scope.conf.papers = {
          accepted: [],
          pending: [],
          rejected: []
        }
        res.data.papers.forEach((el) => {
          switch (el.status) {
            case 0:
              $scope.conf.papers.pending.push(el)
              break
            case 1:
              $scope.conf.papers.accepted.push(el)
              break
            case 2:
              $scope.conf.papers.rejected.push(el)
              break
            default:
              break
          }
        })
      })
    })
    $scope.submit = function () {
      $http.post('/conference/create', $scope.conf).then(res => {
        $location.path('/conferences/' + res.data.conference.id + '/addchairs')
      })
    }
    $scope.accept = function (id) {
      $http.post('/paper/' + id + '/accept').then(res => {
        for (i in $scope.conf.papers.pending) {
          if ($scope.conf.papers.pending[i].id == id) {
            $scope.conf.papers.accepted.push(res.data.paper)
            $scope.conf.papers.pending.slice(i, 1)
          }
        }
      })
    }
    $scope.reject = function (id) {
      $http.post('/paper/' + id + '/reject').then(res => {
        for (i in $scope.conf.papers.pending) {
          $scope.conf.papers.rejected.push(res.data.paper)
          $scope.conf.papers.pending.slice(i, 1)
        }
      })
    }
    $scope.setStatus = function () {
      $scope.req = {
        id: $scope.conf.id,
        state: $scope.conf.paperstate
      }
      $http.post('/conference/setStatus', $scope.req)
    }
    $scope.close = function () {
      $scope.req = {
        id: $scope.conf.id,
        state: 2
      }
      $http.post('/conference/setStatus', $scope.req)
    }
  }
)
