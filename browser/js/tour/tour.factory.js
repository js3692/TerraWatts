app.factory('TourFactory', function($http, $timeout, $state) {
    var TourFactory = {};

    TourFactory.initGrid = function() {
        return $http.get('/api/grid/tour')
        .then(res => {
            res.data.chat = [];
            res.data.players = res.data.game.turnOrder;
            return res.data;
        });
    }

    TourFactory.getTour = function(rootScope, scope) {
        var deregisterSixChosen = angular.noop;
        var deregisterAuctionPass = angular.noop;
        var deregisterCoalBuy = angular.noop;
        var deregisterCityBuy = angular.noop;
        var deregisterBureaucracy = angular.noop;
        var citiesAlreadyBought;

        function disablePrev() {
            $('.btn[data-role=prev]').prop('disabled', true);
        }

        return new Tour({
            name: 'terratour',
            keyboard: false,
            steps: [{
                element: '#action',
                title: 'Welcome!',
                content: 'Welcome to the TerraTour! Err... uhh... Tourawatts? Either way, we will be showing you the different elements of our game, and taking you through a typical turn 1.'
            }, {
                element: 'plant-and-resource-panel',
                title: 'Plant Market',
                content: 'First up is the power plant market. This shows you what power plants are available, as well as which ones are coming up next.'
            }, {
                element: '#plant3',
                title: 'The 3 Plant',
                content: 'Each plant has a minimum cost in the upper left corner, a resource cost, and a number of cities. For example, this plant costs a minimum of $3, and uses 2 oil to power 1 city.'
            }, {
                element: '.resource-menu-tab',
                title: 'Switch Tabs',
                content: 'Click this button to switch to the resource view.'
            }, {
                element: '.resource-menu-tab',
                title: 'Resource Market',
                content: 'This bar graph shows you the current cost of all resources. As players buy up resources, they will get more expensive. At the end of each turn, some resources will be replenished, according to the number on the bar.',
                onShown: function() {
                    rootScope.$broadcast('changePhase', 'resource');
                },
                onHidden: function() {
                    rootScope.$broadcast('changePhase', 'plant');
                }
            }, {
                element: '#playerPanel',
                title: 'Player Panel',
                content: 'Over here is our player panel, where you can see details about each player, such as how much cities and resources they have.',
                placement: 'left',
            }, {
                element: '.chat-tab',
                title: 'Chat',
                content: 'Click here to see the chat/game log. It is currently empty :( Say hi!',
                placement: 'left',
                onShown: function() {
                    rootScope.$broadcast('changeView', 'chat');
                },
                onHidden: function() {
                    rootScope.$broadcast('changeView', 'players');
                }
            }, {
                element: '#maptour',
                title: 'The Map',
                content: 'Finally we get to our zoomable and scrollable map. Your first city costs $10. Every city after that costs $10 plus the cheapest connection cost to your network.'
            }, {
                element: 'command-center',
                title: 'Let\'s start!',
                content: 'Here is where the action happens. As ourHero, you are first in turn order. So pick a plant to begin turn 1! Try picking the 6 plant.',
                onShown: function() {
                    var nextButton = $('.btn[data-role=next]');
                    deregisterSixChosen();
                    nextButton.prop('disabled', true);
                    deregisterSixChosen = scope.$on('sixChosen', function() {
                        scope.grid.state.auction = {
                            plant: scope.grid.game.plantMarket[3],
                            bid: 6,
                            highestBidder: scope.grid.game.turnOrder[0]._id,
                            remainingPlayers: scope.grid.game.turnOrder.slice(),
                            activePlayer: scope.grid.game.turnOrder[1]
                        }
                        nextButton.prop('disabled', false);
                        $timeout();
                    });
                },
                onHidden: deregisterSixChosen
            }, {
                element: 'command-center',
                title: 'The Auction',
                content: 'You\'ve entered a bidding war against your opponents, for the coveted 6 plant. Let\'s see how much they want it.',
                onShown: disablePrev
            }, {
                element: 'command-center',
                title: 'hatesPuppies passes',
                content: 'hatesPuppies has passed, meaning they will not be getting the 6 plant.',
                onShown: function() {
                    disablePrev();
                    scope.grid.state.auction.remainingPlayers.splice(1,1);
                    $timeout();
                }
            }, {
                element: 'command-center',
                title: 'drumpfinator makes a yuuuuge bid',
                content: 'Looks like drumpfinator really wants that trash plant. Shocker. It\'s your turn again. You should just pass and let that jerk have his trash.',
                onShown: function() {
                    deregisterAuctionPass();
                    disablePrev();
                    scope.grid.state.auction.bid = 23;
                    scope.grid.state.auction.highestBidder = scope.grid.game.turnOrder.slice(-1)[0]._id,
                    scope.grid.state.auction.activePlayer = scope.grid.game.turnOrder[0];
                    var nextButton = $('.btn[data-role=next]');
                    nextButton.prop('disabled', true);
                    deregisterAuctionPass = scope.$on('passInAuction', function() {
                        scope.grid.game.turnOrder.slice(-1)[0].plants.push(scope.grid.game.plantMarket[3]);
                        scope.grid.game.turnOrder.slice(-1)[0].money -= 23;
                        scope.grid.game.plantMarket.splice(3,1);
                        scope.grid.game.plantMarket.push(scope.grid.game.plantDeck.shift());
                        delete scope.grid.state.auction;
                        nextButton.prop('disabled', false);
                        $timeout();
                    });
                    $timeout();
                },
                onNext: function() {
                    scope.grid.game.turnOrder[0].plants.push(scope.grid.game.plantMarket[1]);
                    scope.grid.game.turnOrder[0].money -= 4;
                    scope.grid.game.plantMarket.splice(1,1);
                    scope.grid.game.plantMarket.push(scope.grid.game.plantDeck.shift());
                    scope.grid.game.turnOrder[1].plants.push(scope.grid.game.plantMarket[2]);
                    scope.grid.game.turnOrder[1].money -= 7;
                    scope.grid.game.plantMarket.splice(2,1);
                    scope.grid.game.plantMarket.push(scope.grid.game.plantDeck.shift());
                    $timeout();
                },
                onHidden: deregisterAuctionPass
            }, {
                element: 'command-center',
                title: 'Fast-forward',
                content: 'The auction progresses until each player has a plant. Let\'s say you picked up the 4, and hatesPuppies ended up with the 7.',
                onShown: disablePrev
            }, {
                element: '#playerPanel',
                title: 'Entering resource phase',
                content: 'Everybody has a power plant, so we are now done with the plant phase. Next up is the resource phase. On the first turn, we recalculate turn order based on that player\'s plant. Whoever is last will get to buy resources first.',
                onShown: function() {
                    disablePrev();
                    rootScope.$broadcast('changeView', 'players');
                    scope.grid.game.turnOrder = [
                        scope.grid.game.turnOrder[1],
                        scope.grid.game.turnOrder[2],
                        scope.grid.game.turnOrder[0]
                    ];
                    $timeout();
                },
                placement: 'left'
            }, {
                element: '.resource-menu-tab',
                title: 'Buy Resources!',
                content: 'You\'re up first for resources. Since you only have a coal plant, you can only buy coal. Your plant only needs two coal, but you can hold up to four. Make sure to buy enough!',
                onShown: function() {
                    disablePrev();
                    deregisterCoalBuy();
                    var nextButton = $('.btn[data-role=next]');
                    nextButton.prop('disabled', true);
                    scope.grid.state.phase = 'resource';
                    scope.grid.state.activePlayer = scope.grid.game.turnOrder[2];
                    deregisterCoalBuy = scope.$on('boughtCoal', function(e, numCoal) {
                        scope.grid.game.turnOrder[2].resources.coal = numCoal;
                        if(numCoal < 4) {
                            scope.grid.game.turnOrder[2].money -= numCoal;
                        } else scope.grid.game.turnOrder[2].money -= 5;
                        scope.grid.game.resourceMarket.coal -= numCoal;
                        scope.grid.state.activePlayer = scope.grid.game.turnOrder[1];
                        nextButton.prop('disabled', false);
                        $timeout();
                    });
                    $timeout();
                },
                onHidden: deregisterCoalBuy
            }, {
                element: '.resource-menu-tab',
                title: 'Everyone else buys resources',
                content: 'Your opponents have bought enough resources to power the plants they bought.',
                onShown: function() {
                    disablePrev();
                    scope.grid.game.turnOrder[0].resources.oil += 3;
                    scope.grid.game.resourceMarket.oil -= 3;
                    scope.grid.game.turnOrder[0].money -= 9;
                    scope.grid.game.turnOrder[1].resources.trash += 1;
                    scope.grid.game.resourceMarket.trash -= 1;
                    scope.grid.game.turnOrder[1].money -= 7;
                    scope.grid.state.activePlayer = scope.grid.game.turnOrder[0];
                    $timeout();
                },
                onNext: function() {
                    scope.grid.state.phase = 'city';
                    scope.grid.state.activePlayer = scope.grid.game.turnOrder[2];
                    $timeout();
                }
            }, {
                element: 'command-center',
                title: 'City Phase',
                content: 'Now comes a big moment. Where will you place your first city? Since you can only power one city, we\'d recommend that you only buy one, but feel free to buy as many as you can afford. Choose wisely.',
                onShown: function() {
                    disablePrev();
                    deregisterCityBuy();
                    var nextButton = $('.btn[data-role=next]');
                    nextButton.prop('disabled', true);
                    deregisterCityBuy = scope.$on('cityBuy', function(e, cities, price) {
                        if(!scope.grid.game.turnOrder[2].cities.length) {
                            citiesAlreadyBought = cities;
                            scope.grid.game.turnOrder[2].cities = scope.grid.game.turnOrder[2].cities.concat(cities);
                            scope.grid.game.turnOrder[2].money -= price;
                            scope.grid.state.activePlayer = scope.grid.game.turnOrder[1];
                        }
                        nextButton.prop('disabled', false);
                        $timeout();
                    });
                    $timeout();
                },
                onHidden: deregisterCityBuy
            }, {
                element: '#playerPanel',
                title: 'Your opponents buy cities',
                content: 'Time for your evil opponents to choose their starting positions. Looks like hatesPuppies only bought one city even though they can power two. Maybe they should take some time out of their busy schedule hating puppies to bone up on some terrastrategy.',
                onShown: function() {
                    disablePrev();
                    function getUnoccupiedCity() {
                        return scope.grid.game.cities.reduce(function(result, city) {
                            if(result) return result;
                            if(citiesAlreadyBought.map(city => city._id).indexOf(city._id) > -1) return result;
                            return city;
                        }, null);
                    }
                    if(!scope.grid.game.turnOrder[1].cities.length) {
                        var drumpfCity = getUnoccupiedCity();
                        citiesAlreadyBought.push(drumpfCity);
                        scope.grid.game.turnOrder[1].cities.push(drumpfCity);
                        scope.grid.game.turnOrder[1].money -= 10;
                        var puppiesCity = getUnoccupiedCity();
                        scope.grid.game.turnOrder[0].cities.push(puppiesCity);
                        scope.grid.game.turnOrder[0].money -= 10;
                        scope.grid.state.activePlayer = scope.grid.game.turnOrder[0];
                    }
                    $timeout();
                },
                placement: 'left'
            }, {
                element: '#playerPanel',
                placement: 'left',
                title: 'Bureaucracy phase',
                content: 'The final phase of the turn is bureaucracy. Players spend their resources to power their plants and make money. The more cities you power, the more money you make. Your opponents have already done this, now it\'s your turn!',
                onShown: function() {
                    disablePrev();
                    deregisterBureaucracy();
                    var nextButton = $('.btn[data-role=next]');
                    nextButton.prop('disabled', true);
                    scope.grid.state.phase = 'bureaucracy';
                    scope.grid.state.activePlayer = scope.grid.game.turnOrder[2];
                    scope.grid.game.turnOrder[0].resources.oil = 0;
                    scope.grid.game.turnOrder[0].money += 22;
                    scope.grid.game.turnOrder[1].resources.trash = 0;
                    scope.grid.game.turnOrder[1].money += 22;
                    deregisterBureaucracy = scope.$on('power', function() {
                        scope.grid.game.turnOrder[2].resources.coal -= 2;
                        scope.grid.game.turnOrder[2].money += 22;
                        nextButton.prop('disabled', false);
                        scope.grid.state.phase = 'plant';
                        scope.grid.game.turn++;
                        scope.grid.state.activePlayer = scope.grid.game.turnOrder[0];
                        $timeout();
                    });
                    $timeout();
                }
            }, {
                element: 'command-center',
                title: 'That\'s it!',
                content: 'The first turn is over! Congratulations, you are well on your way to learn the ins and outs of Terrawatts. Make an account and start a real game with some friends and/or strangers. Thanks for sticking with the tour!'
            }
        ],
        onEnd: function() {
            $state.go('login');
        }
    });
    }

    return TourFactory;
});
