app.factory('TourFactory', function($http, $timeout) {
    var TourFactory = {};

    TourFactory.initGrid = function() {
        return $http.get('/api/grid/tour')
        .then(res => {
            res.data.chat = [];
            this.grid = res.data;
            return res.data;
        });
    }

    TourFactory.getTour = function(rootScope, scope) {
        var deregisterSixChosen = angular.noop;
        var deregisterAuctionPass = angular.noop;

        function disablePrev() {
            $('.btn[data-role=prev]').prop('disabled', true);
        }

        return new Tour({
            name: 'terratour',
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
                    nextButton.prop('disabled', true);
                    deregisterSixChosen = scope.$on('sixChosen', function() {
                        scope.grid.state.auction = {
                            plant: scope.grid.game.plantMarket[3],
                            bid: 6,
                            highestBidder: scope.grid.game.turnOrder[0]._id,
                            remainingPlayers: scope.grid.players,
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
            }
        ]});
    }

    return TourFactory;
});
