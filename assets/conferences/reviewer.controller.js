app.controller('reviewerController',
 ($scope, $http, $routeParams, $location) => {
   $http.post('/user/getdata').then(res => {
     $scope.user = res.data.user
   })
  $scope.filterPapers = function(conference){
	return function(paper){
		console.log(paper);
		console.log(conference);
		return conference == paper.conference;
	}
  }
});