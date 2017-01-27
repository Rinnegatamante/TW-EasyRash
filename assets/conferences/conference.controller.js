app.controller('conferenceController',
 ($scope, $http, $routeParams, $location) => {
   $scope.conf = {
     id: $routeParams.cid
   }
   console.log($scope.conf.id)
   $http.post('/conference/getData', $scope.conf).then(res => {
     $scope.conf = res.data.conference
     $scope.conf.paperstate = '' + res.data.conference.status
     $http.post('/conference/papers', $scope.conf).then(res => {
       $scope.conf.papers = []
       res.data.papers.forEach((el) => {
         if (el.status == 1) $scope.conf.papers.push(el)
       })
     })
   })

   $scope.create = function () {
     $location.path('/conferences/create')
   }
 })
