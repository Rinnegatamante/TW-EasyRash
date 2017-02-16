// Controller for managepapers template
app.controller('managepapersController', ($scope, $http, $rootScope, $location, $routeParams) => {
	// Check if the user is logged, instead redirect to welcome page
  $http.post('/user/getdata').then(res => {}, function errorCallback (response) {
    $location.path('/') // Redirect to welcome page if not logged
  })

	// Get conference ID from URL
  $scope.conf = {
    id: $routeParams.cid
  }

	// Request conference data
  $http.post('/conference/getData', $scope.conf).then(res => {
    $scope.conf = res.data.conference
    $scope.conf.paperstate = '' + res.data.conference.status

		// Request conference papers
    $http.post('/conference/papers', $scope.conf).then(res => {
      $scope.conf.papers = {
        accepted: [],
        pending: [],
        rejected: []
      }

			// Distinguishing papers in terms of their states
      res.data.papers.forEach((el) => {
        switch (el.status) {
          case 0:
            $scope.conf.papers.pending.push(el)
            break
          case 1:
            $scope.conf.papers.accepted.push(el)
            break
          case 2:
            $scope.conf.papers.rejected.push(el)
            break
          default:
            break
        }
      })
    })
  })

	// accept function, sets a paper to accepted state
  $scope.accept = function (id) {
    var paper = $scope.conf.papers.pending.find((p) => {
      return p.id == id
    })
    $http.get(paper.url).then(res => {
      $scope.view = res.data
      $('#view').html($scope.view)
      loadChairJSONLD(paper, $rootScope.user, 1)
      $http.post('/paper/' + id + '/accept', {rash: document.getElementById('view').innerHTML}).then(res => {
	      for (i in $scope.conf.papers.pending) {
	        if ($scope.conf.papers.pending[i].id == id) {
	          $scope.conf.papers.accepted.push(res.data.paper)
	          $scope.conf.papers.pending.splice(i, 1)
	        }
	      }
	    })
    })
  }

	// reject function, sets a paper to rejected state
  $scope.reject = function (id) {
    var paper = $scope.conf.papers.pending.find((p) => {
      return p.id == id
    })
    $http.get(paper.url).then(res => {
      $scope.view = res.data
      $('#view').html($scope.view)
      loadChairJSONLD(paper, $rootScope.user, 2)
      $http.post('/paper/' + id + '/reject').then(res => {
	      for (i in $scope.conf.papers.pending) {
	        if ($scope.conf.papers.pending[i].id == id) {
	          $scope.conf.papers.rejected.push(res.data.paper)
	          $scope.conf.papers.pending.splice(i, 1)
	        }
	      }
	    })
    })
  }
})

var loadChairJSONLD = (paper, user, status) => { // insert into the paper json-ld information
  var comments = []
  var date = new Date()
  var pso = status == 1 ? 'accepted-for-pubblivation' : 'rejected-for-pubblication'

  var ld = [{
    '@context': 'easyrash.json',
    '@type': 'decision',
    '@id': '#decision1',
    'article': {
      '@id': paper.id,
      'eval': {
        '@context': 'easyrash.json',
        '@id': '#decision1-eval',
        '@type': 'score',
        'status': 'pso:' + pso,
        'author': 'mailto:' + paper.owner.email,
        'date': date.toUTCString()
      }
    }
  }]

  var view = document.getElementById('view')
  var title = view.getElementsByTagName('title')[0]
  var script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.innerHTML = JSON.stringify(ld)
  title.parentNode.insertBefore(script, title.nextSibling)
}
