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
        for (i in $scope.papers.pending) {
          if ($scope.papers.pending[i].id == id) {
            $scope.papers.accepted.push(res.data.paper)
            $scope.papers.pending[i] = {}// TODO
          }
        }
      })
    }
    $scope.reject = function (id) {
      $http.post('/paper/' + id + '/reject').then(res => {
        for (i in $scope.papers.pending) {
          $scope.papers.rejected.push(res.data.paper)
          $scope.papers.pending[i] = {}// TODO
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
