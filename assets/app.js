var app = angular.module('easyrashApp', ['ngRoute'])
app.config(['$locationProvider', '$routeProvider',
 function ($locationProvider, $routeProvider) {
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
 }])
