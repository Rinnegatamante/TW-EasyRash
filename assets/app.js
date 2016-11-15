var app = angular.module('easyrashApp', ['ngRoute', 'ngAnimate'])

app.run(($http, $rootScope, $location) => {
  if (localStorage.getItem('id') && localStorage.getItem('token')) {
    $http.post('/user/getdata').then(res => {
      $rootScope.user = res.data.user
      $location.path('/home')
    })
  }
})
app.factory('HttpInterceptorMessage', ['$q', '$location', function ($q, $location) {
  return {
    // optional method
    'request': function (config) {
      // do something on success
      var id = localStorage.getItem('id')
      var token = localStorage.getItem('token')
      if (token && id) {
        console.log(token, id)
        config.headers['www-authenticate'] = window.btoa(id + ' ' + token)
      }
      return config
    },
    'response': function (response) {
     // do something on success
      if (response.data.message) {
        alertify.success('<svg class="glyph stroked checkmark"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#stroked-checkmark"></use></svg>  \
        <p>' + response.data.message + '</p>')
      };
      return response
    },

    'responseError': function (rejection) {
     // do something on error
      if (rejection.data.message) {
        alertify.error('<svg class="glyph stroked cancel"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#stroked-checkmark"></use></svg>\
          <p>' + response.data.message + '</p>')
      }
      if (rejection.data.error) {
        alertify.error('<svg class="glyph stroked cancel"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#stroked-checkmark"></use></svg>\
          <p>' + rejection.data.error.error + '</p>')
      }

      return $q.reject(rejection)
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

   $httpProvider.interceptors.push('HttpInterceptorMessage')
 }])
