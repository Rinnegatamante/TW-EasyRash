app.controller('papersController',
  ($scope, $http, $rootScope, $location) => {
    $scope.settings = false
    $scope.filter = {
      name: '',
      accepted: true,
      pending: true,
      rejected: true,
      orderBy: 'name'
    }
    $scope.getdata = () => {
      $http.post('/user/getdata').then(res => {
        console.info('FILE -user:', res.data.user)
        $scope.user = res.data.user
        for (i in $scope.user.papers) {
          $http.get('/paper/' + $scope.user.papers[i].id).then(res => {
            for (i in $scope.user.papers) {
              if ($scope.user.papers[i].id == res.data.paper.id)
                { $scope.user.papers[i] = res.data.paper }
            }
          })
        }
      })
    }
    $scope.getdata()

    $scope.deletePaper = (pid) => {
      if (!confirm('Are you sure?')) return
      $http.post('/paper/' + pid + '/delete').then(res => {
        for (i in $scope.user.papers) {
          if ($scope.user.papers[i].id == pid) $scope.user.papers.splice(i, 1)
        }
      })
    }

    $scope.filterCheckBox = (paper) => {
      if ($scope.filter.accepted && paper.status == 1) return true
      if ($scope.filter.pending && paper.status == 0) return true
      if ($scope.filter.rejected && paper.status == 2) return true
      return false
    }

    $scope.status = (status) => {
      switch (status) {
        case 0:
          return 'pending'
          break
        case 1:
          return 'accepted'
          break
        case 2:
          return 'rejected'
          break
      }
    }
  })
