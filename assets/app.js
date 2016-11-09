var app = angular.module('easyrashApp', ['ngRoute'])
app.config(['$locationProvider', '$routeProvider',
 function ($locationProvider, $routeProvider) {
   $routeProvider
   .when('/login', {
     templateUrl: 'login/login.template.html'
   })
 }])
