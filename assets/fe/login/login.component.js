angular
  .module('easyrashApp')
  .component('loginPage', {
    templateUrl: 'login/login.template.html',
    controller: ($scope, $http) => {
      /* $http.get('/register').then(res => {
        $scope.page = res.data
      }) */
    }
  })
