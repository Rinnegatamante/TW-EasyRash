app.controller('homeController',
 ($scope, $http, $routeParams, $location) => {
	 $http.post('/user/getdata').then(res => {
		$scope.user = res.data.user
		$scope.user.conf_memberships = res.data.user.reviewer_conferences.length + res.data.user.chair_conferences.length
		$scope.user.conf_papers = []
		$scope.user.pending_num = 0
		$scope.user.accepted_num = 0
		$scope.user.rejected_num = 0
		$scope.user.need_change_num = 0
		for (i=0;i<res.data.user.chair_conferences.length;i++){
			for (z=0;z<res.data.user.reviewer_conferences.length;z++){
				if (res.data.user.chair_conferences[i].id == res.data.user.reviewer_conferences[z].id){
					$scope.user.conf_memberships--;
					break;
				}
			}
		}
		for (i=0;i<res.data.user.reviewer_conferences.length;i++){
			var j=0;
			$scope.user.conf_papers.push({
				title: res.data.user.reviewer_conferences[i].title,
				papers: [],
				id: res.data.user.reviewer_conferences[i].id
			})
			for (z=0;z<res.data.user.reviewer_papers.length;z++){
				if (res.data.user.reviewer_conferences[i].id == res.data.user.reviewer_papers[z].conference){
					$scope.user.conf_papers[i].papers[j] = $scope.user.reviewer_papers[z].title;
					j++;
				}
			}
		}
		for (i=0;i<res.data.user.papers.length;i++){
			switch (res.data.user.papers[i].status){
				case 0:
					$scope.user.pending_num++;
					break;
				case 1:
					$scope.user.accepted_num++;
					break;
				case 2:
					$scope.user.rejected_num++;
					break;
				default:
					$scope.user.need_change_num++;
					break;
			}
		}
	})
 })
