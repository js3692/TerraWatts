app.factory('UserFactory', function ($http) {
	var UserFactory = {};

	UserFactory.createUser = function(body) {
		return $http.post('/api/user', body)
		.then(function(newUser) {
			return newUser;
		})
	}

	UserFactory.fetchById = function(userId) {
		return $http.get('/api/user/' + userId)
		.then(function (response) {
			return response.data;
		})
	}
	return UserFactory;
})