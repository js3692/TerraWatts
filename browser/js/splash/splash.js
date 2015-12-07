app.config(function ($stateProvider) {
	$stateProvider.state('splash', {
		url: '/',
		templateUrl: 'js/splash/splash.html',
		controller: 'SplashCtrl'
	})
});

app.controller('SplashCtrl', function ($scope) {
	var imagesHolder = [
	{
		imageUrl: 'wind-turbines',
		color: 'black',
	},{
		imageUrl: 'nuclear-winter',
		color: 'white',
	},{
		imageUrl: 'plant-on-water',
		color: 'white',
	}]

	$scope.imageInfo = imagesHolder[Math.floor(Math.random()*imagesHolder.length)];

	$scope.getImageUrl = function() {
		return $scope.imageInfo.imageUrl + '.jpg';
	}

});