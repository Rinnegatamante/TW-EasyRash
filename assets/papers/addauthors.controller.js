// Controller for addauthors template
app.controller('addauthorsController',($scope, $http, $routeParams, $location, $rootScope, FileUploader) => {
	
	var pid = $routeParams.pid // Getting papers id from URL
	$scope.co_authors = []
	
	// Getting logged user data
	$scope.getdata = () => {
		$http.post('/user/getdata').then(res => {
			$scope.user = res.data.user
			
			// Get authors of the paper
			$http.get('/paper/' + pid).then(res => {
				$scope.paper = res.data.paper
				$scope.co_authors = res.data.paper.author
			})
		},function errorCallback(response) {
			$location.path('/') // Redirect to welcome page if not logged
		});
	}
	
	$scope.getdata() // Executing getdata function at controller loading
	
	// Watching if search field changes
	$scope.$watch('user.field', function (newVal, oldVal) {
		if (newVal != oldVal) { // Modification detected, executing an user research by name
			$http.post('/user/searchByName', $scope.user).then(res => {
				$scope.users = res.data.users
			})
		}
	})
	
	// add function, adds a new author to the paper
	$scope.add = function (user) {
		$http.post('/paper/' + pid + '/addauthor/' + user.id).then(res => {
			$scope.co_authors.push(user)
		})
	}
	
	// remove function, removes an author from the paper
	$scope.remove = function (user) {
		$http.post('/paper/' + pid + '/removeauthor/' + user.id).then(res => {
			for (i in $scope.co_authors) {
				if ($scope.co_authors[i].id == user.id) {
					$scope.co_authors.splice(i, 1)
				}
			}
		})
	}
	
})