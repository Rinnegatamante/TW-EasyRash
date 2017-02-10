app.filter('checkId', function() {
	return function(input) {
		if (input == 1) return input;
		else return input;
	}
}).controller('reviewerController',
 ($scope, $http, $routeParams, $location) => {
   $http.post('/user/getdata').then(res => {
     $scope.user = res.data.user
   })
 });