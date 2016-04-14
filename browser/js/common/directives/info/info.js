app.directive('info', function(PlayGameFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/info/info.html',
        link: function(scope) {
            var numPlayers = PlayGameFactory.getTurnOrder().length;

            function Restock(coal, oil, trash, nuke) {
                this.coal = coal;
                this.oil = oil;
                this.trash = trash;
                this.nuke = nuke;
            }

            scope.restockRates = {
                2: {
                    1: new Restock(3,2,1,1),
                    2: new Restock(4,2,2,1),
                    3: new Restock(3,4,3,1),
                },
                3:{
                    1: new Restock(4,2,1,1),
                    2: new Restock(5,3,2,1),
                    3: new Restock(3,4,3,1),
                },
                4:{
                    1: new Restock(5,3,2,1),
                    2: new Restock(6,4,3,2),
                    3: new Restock(4,5,4,2),
                },
                5:{
                    1: new Restock(5,4,3,2),
                    2: new Restock(7,5,3,2),
                    3: new Restock(5,6,5,2),
                },
                6:{
                    1: new Restock(7,5,3,2),
                    2: new Restock(9,6,5,3),
                    3: new Restock(6,7,6,3),
                }
            }[numPlayers];

            scope.resources = ['coal', 'oil', 'trash', 'nuke']
            scope.getStep = PlayGameFactory.getStep;
            scope.stepTwo = [0,0,10,7,7,7,6][numPlayers];
            scope.endGame = [0,0,21,17,17,15,14][numPlayers];
            scope.getDeckSize = PlayGameFactory.getDeckSize;
            scope.getStepThreePlants = PlayGameFactory.getStepThreePlants;
            scope.getDiscardedPlants = PlayGameFactory.getDiscardedPlants;
        }
    }
})
