// Controller for reviewer template
app.controller('reviewerController',($scope, $http, $routeParams, $location) => {
	
	// Get logged user data
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
	})
	
	// Angular filter to check assigned papers for each assigned conference
	$scope.filterPapers = function(conference){
		return function(paper){
			return conference == paper.conference;
		}
	}
	
})