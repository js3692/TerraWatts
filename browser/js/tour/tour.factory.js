app.factory('TourFactory', function($http) {
    var TourFactory = {};

    TourFactory.initGrid = function() {
        return $http.get('/api/grid/tour')
        .then(res => {
            res.data.chat = [];
            this.grid = res.data;
            return res.data;
        });
    }

    TourFactory.getTour = function(rootScope) {
        return new Tour({
            name: 'terratour',
            steps: [{
                element: '#action',
                title: 'Welcome!',
                content: 'Welcome to the TerraTour! We will be showing you the different elements of our game, and taking you through a typical turn 1.'
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
                content: 'Here is where the action happens. As ourHero, you are first in turn order. So pick a plant to begin turn 1! Try picking the 6 plant.'
            }
        ]});
    }

    return TourFactory;
});
