// Controller for newconf template
app.controller('newconfController', ($scope, $http, $location) => {
  $scope.conf = {}

	// Check if the user is logged, instead redirect to welcome page
  $http.get('/user/getdata').then(res => {}, function errorCallback (response) {
    $location.path('/') // Redirect to welcome page if not logged
  })

	// submit function, starts a new conference
  $scope.submit = function () {
    $http.put('/conference/create', $scope.conf).then(res => {
      $location.path('/conferences/' + res.data.conference.id + '/addreviewers')
    })
  }
})
