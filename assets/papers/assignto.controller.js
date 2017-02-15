// Controller for assignto template
app.controller('assigntoController',($scope, $http, $routeParams, $location) => {
	
	// Getting logged user data
	$http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
	},function errorCallback(response) {
		$location.path('/') // Redirect to welcome page if not logged
	});
	
	var uid = $routeParams.uid // Getting user ID from URL
	var cid = $routeParams.cid // Getting conference ID from URL
	if ($scope.paper === undefined) $scope.paper = {}
	if ($scope.conference === undefined) $scope.conference = {}
	$scope.conference.id = cid
	$scope.paper.field = '' // field is used as Angular filter input
	
	// Getting conference's papers
	$http.post('/conference/getPapers', $scope.conference).then(res => {
		
		// Removing already assigned papers
		$scope.papers = []
		for (i=0;i<res.data.papers.length;i++){
			if (res.data.papers[i].status == 0){ // Excluding accepted/rejected papers
				var assigned = false
				for (z=0;z<res.data.papers[i].reviewers.length;z++){
					if (res.data.papers[i].reviewers[z].id == $scope.user.id){
						assigned = true
						break
					}
				}
				if (!assigned){
					$scope.papers.push(res.data.papers[i]);
				}
			}
		}
		
	})
	
	// assign function, assigns a paper to the selected user
	$scope.assign = function (id) {
		$http.post('/paper/' + id + '/addreviewer/' + uid).then(res => {
			$location.path('/conference/' + cid)
		})
	}
	
})