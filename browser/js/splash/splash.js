app.config(function ($stateProvider) {
	$stateProvider.state('splash', {
		url: '/',
		templateUrl: 'js/splash/splash.html',
		controller: 'SplashCtrl'
	})
});

app.controller('SplashCtrl', function ($scope, $state, AppConstants) {
	var imagesHolder = [
	{
		imageUrl: 'wind-turbines',
		color: '#0C161E',
	},{
		imageUrl: 'nuclear-winter',
		color: '#ddd',
	},{
		imageUrl: 'plant-on-water',
		color: '#ddd',
	}]

	$scope.imageInfo = imagesHolder[Math.floor(Math.random()*imagesHolder.length)];

	$scope.getImageUrl = function() {
		return $scope.imageInfo.imageUrl + '.jpg';
	}

	$scope.enter = function () {
		angular.element("#splash-main")
      .addClass("zoomOut")
      .one(AppConstants.animationEndEvent, function () {
        $state.go('login');
      })
	}

});