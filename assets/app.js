var app = angular.module('easyrashApp', ['ngRoute'])

app.factory('HttpInterceptorMessage', ['$q', '$location', function ($q, $location) {
  return {
    'response': function (response) {
     // do something on success
      console.log(response)
      if (response.data.message) {
        alertify.success(response.data.message)
      };
      return response
    },

    'responseError': function (rejection) {
     // do something on error
      console.log(rejection)
      if (rejection.data.message) {
        alertify.error(rejection.data.message)
      }
      if (rejection.data.error) {
        alertify.error(rejection.data.error.error)
      }

      return $q.reject(rejection)
    }
  }
}])

app.config(['$locationProvider', '$routeProvider', '$httpProvider',
 function ($locationProvider, $routeProvider, $httpProvider) {
   $routeProvider
   .when('/', {
     templateUrl: 'login/login.template.html'
   })
   .when('/login', {
     templateUrl: 'login/login.template.html'
   })
   .when('/register', {
     templateUrl: 'register/register.template.html'
   })

   $httpProvider.interceptors.push('HttpInterceptorMessage')
 }])
