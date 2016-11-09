angular
  .module('easyrashApp')
  .component('loginPage', {
    controller: ['$routeParams', ($scope, $http, $routeParams) => {
      var digest = (name, password) => {
        var ha1 = this.password // digest password
        var ha2 = 'POST' + window.location.href
        var d = new Date()
        var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
        return (md5(ha1 + nonce + ha2))
      }

      $scope.submit = function () {
        var data = {
          email: $scope.user.email,
          digest: digest($scope.user.email, $scope.user.password)
        }

        $http.post('/user/login', data).then(res => {
          $scope.res = res.data
        })
      }
    }]
  })
