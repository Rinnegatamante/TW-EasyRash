var app = angular.module('easyrashApp', ['ngRoute', 'ngAnimate', 'angularFileUpload'])

app.run(($http, $rootScope, $location) => {
  if (localStorage.getItem('id') && localStorage.getItem('token')) {
    $http.post('/user/getdata').then(res => {
      $rootScope.user = res.data.user
      $location.path('/home')
    })
  }
})
app.factory('HttpInterceptorMessage', ['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
  return {
    // optional method
    'request': function (config) {
      // do something on success
      if ($rootScope.user) {
        var id = $rootScope.user.id
        var token = $rootScope.user.token
      } else {
        var id = localStorage.getItem('id')
        var token = localStorage.getItem('token')
      }
      if (token && id) {
        console.info('found token e id: ', token, id)
        config.headers['www-authenticate'] = window.btoa(id + ' ' + token)
      }
      return config
    },
    'response': function (response) {
     // do something on success
      if (response.data.message) {
        alertify.success(response.data.message)
      };
      return response
    },

    'responseError': function (response) {
     // do something on error

      if (response.data && response.data.message) {
        alertify.error(response.data.message)
      }
      if (response.data && response.data.error) {
        alertify.error(response.data.error.error)
      }

      return $q.reject(response)
    }
  }
}])

app.config(['$locationProvider', '$routeProvider', '$httpProvider',
 function ($locationProvider, $routeProvider, $httpProvider) {
   $routeProvider
   .when('/', {
     templateUrl: 'welcome/welcome.template.html'
   })
   .when('/login', {
     templateUrl: 'login/login.template.html'
   })
   .when('/register', {
     templateUrl: 'register/register.template.html'
   })
   .when('/home', {
     templateUrl: 'home/home.template.html'
   })
   .when('/conferences', {
     templateUrl: 'conferences/conferences.template.html'
   })
   .when('/papers', {
     templateUrl: 'papers/papers.template.html'
   })
   .when('/logout', {
     templateUrl: 'login/logout.template.html'
   })
   .when('/forgot', {
     templateUrl: 'login/forgot.template.html'
   })
   .when('/reset', {
     templateUrl: 'login/reset.template.html'
   })

   $httpProvider.interceptors.push('HttpInterceptorMessage')
 }])
