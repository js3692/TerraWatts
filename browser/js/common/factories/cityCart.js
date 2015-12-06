app.factory('CityCartFactory', function($rootScope, PlayGameFactory) {
	var cityCart = [],
        CCFactory = {};
    
    CCFactory.toggle = function(city){
        
        for(var i = 0; i < cityCart.length; i++){
            if(city.id === cityCart[i].id) {
                cityCart.splice(i, 1);
                $rootScope.$digest();
                return;
            }
        }
        cityCart.push(city);
        console.log('cityCart', cityCart)
        $rootScope.$digest();
        
    };
    
    CCFactory.getCart = function(){
        return cityCart;
    };
    
    CCFactory.getCartPrice = function(citiesToAdd){
        var game = PlayGameFactory.getGame();
        var player = PlayGameFactory.getMe();
        return totalCost(game, citiesToAdd, player);
    }

    CCFactory.getPopulatedCities = function(players) {
        var populatedCities = [];
        players.forEach(function(player) {
            if(player.cities) {
                var currPlayer = { name: player.user.username, id: player._id, color: player.color }
                player.cities.forEach(function(city) {
                    var currCity = { name: city.name, id: city.id, players: [currPlayer] }
                    if(!populatedCities.length) {
                        populatedCities.push(currCity);
                        return populatedCities;
                    } else {
                        var hasCity = false;
                        for(var i = 0; i < populatedCities.length; i++) {
                            if(populatedCities[i].id === city.id) {
                                populatedCities[i].players.push(currPlayer);
                                hasCity = true;
                            }
                        }
                        if(!hasCity) populatedCities.push(currCity);
                    }
                })
            }
        });
        return populatedCities;
    }
    
    //city price algorithm -- needs dij and num residents -- rename;
    
    function totalCost(game, citiesToAdd, player) {
        var network = player.cities || [];
        var connectionCost = dij(citiesToAdd, network, game.cities, game.connections);
        var citiesCost = citiesToAdd.reduce(function(prevCost, currentCity) {
            var cityCost = numResidents(currentCity, game.turnOrder)*5 + 10;
            return prevCost + cityCost;
        }, 0);
        return connectionCost + citiesCost;
    }
    
    //num residents
    
    function numResidents (city, players) {
        return players.reduce(function (prev, player) {
            var isResident = 0;
            player.cities = player.cities || [];
            player.cities.forEach(function (c) {
                if (c === city.id) isResident = 1;
            });
            
            return prev + isResident;
        }, 0)
    }
    
    //dij
    
    function dij(citiesToAdd, network, cities, connections) {
        var networkCopy = network.slice();
        var citiesToAddCopy = citiesToAdd.slice();
        var cost = 0;
        while(citiesToAddCopy.length) {
            var distances = citiesToAddCopy.map(function(city) {
                return cheapestDistanceTo(city, networkCopy, cities, connections)
            });
            var cheapest = Math.min.apply(null, distances);
            var cheapestIndex = distances.indexOf(cheapest);
            cost += cheapest;
            networkCopy.push(citiesToAddCopy.splice(cheapestIndex,1)[0]);
        }
        return cost;
    }

    function cheapestDistanceTo(destination, network, cities, connections) {
        if(!network.length) return 0;

        var data = cities.map(function(city) {
            return {
                city: city,
                distance: containsCity(network, city) ? 0 : Infinity,
                visited: false
            }
        })

        var currentNode = _.find(data, function(node) {
            return !node.distance;
        })

        while(!getNode(destination, data).visited) {
            var connectionsToCurrent = connectionsTo(currentNode.city, connections);
            unvisitedNeighbors(currentNode, data, connectionsToCurrent).forEach(function (unvisitedNode) {
                var connectionCost = directConnection(currentNode, unvisitedNode, connections).distance;
                var tempDistance = currentNode.distance + connectionCost;
                if (tempDistance < unvisitedNode.distance) unvisitedNode.distance = tempDistance;
            })
            currentNode.visited = true;
            currentNode = getNewCurrent(data);
        }
        return getNode(destination, data).distance;
    }

    function containsCity(cities, city) {
        return !!_.find(cities, function(c) {
            return city._id === c.id;
        })
    }

    function connectionsTo(city, connections) {
        return connections.filter(function (connection) {
            return containsCity(connection.cities, city);
        })
    }

    function unvisitedNeighbors(node, data, connectionsToNode) {
        var neighboringCities = connectionsToNode.map(function (connection) {
            return connection.cities.filter(function (city) {
                return city._id !== node.city._id;
            })[0];
        })
        
        return data.filter(function (node) {
            return containsCity(neighboringCities, node.city) && !node.visited;
        })
    }

    function directConnection(node1, node2, connections) {
        return connectionsTo(node1.city, connections).filter(function (connection) {
            return containsCity(connection.cities, node2.city);
        })[0]
    }

    function getNode(city, data) {
        return _.find(data, function(node) {
            return node.city._id === city.id;
        })
    }

    function getNewCurrent(data) {
        var unvisitedNodes = data.filter(function (node) {
            return !node.visited;
        })
        if (!unvisitedNodes) return;
        else {
            var minDist = Infinity;
            var newCurrent;
            unvisitedNodes.forEach(function (node) {
                if (node.distance < minDist) {
                    newCurrent = node;
                    minDist = node.distance;
                }
            })
            return newCurrent;
        }
    }

    
	return CCFactory;
})