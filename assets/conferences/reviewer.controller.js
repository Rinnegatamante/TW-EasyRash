// Controller for reviewer template
app.controller('reviewerController',($scope, $http, $routeParams, $location) => {
	
	// Get logged user data
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
	},function errorCallback(response) {
		$location.path('/') // Redirect to welcome page if not logged
	});
	
	// Angular filter to check assigned papers for each assigned conference
	$scope.filterPapers = function(conference){
		return function(paper){
			var not_reviewed = true
			for (i=0;i<$scope.user.reviews.length;i++){
				if ($scope.user.reviews[i].paper == paper.id){
					not_reviewed = false
					break
				}
			}
			return (not_reviewed && conference == paper.conference && paper.status < 1);
		}
	}
	
})