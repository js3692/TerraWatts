app.directive('plantAction', function(PlayGameFactory, $rootScope, $state){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/plantAction/plantAction.html',
        scope: {
            plant: '='
        },
        link: function(scope, elem, attrs){
            scope.getPlantToBidOn = PlayGameFactory.getPlantToBidOn;
            scope.getActivePlayer = PlayGameFactory.getActivePlayer;
            scope.justPicked = false;

            var update = {
                phase: 'plant',
                data: {}
            };

            scope.pass = function(){
                //for tour:
                if($state.is('tour')) {
                    $rootScope.$broadcast('passInAuction');
                } else {
                    update.player = PlayGameFactory.getMe();
                    update.data = 'pass';
                    PlayGameFactory.continue(update)
                        .then(function(){
                            update.data = {};
                        });
                }
                scope.justPicked = true;

            };

            scope.pickPlant = function(){
                update.player = PlayGameFactory.getMe();
                update.data.plant = PlayGameFactory.getPlantToBidOn();

                //for tour:
                if($state.is('tour') && update.data.plant.rank === 6) {
                    $rootScope.$broadcast('sixChosen');
                }

                update.data.bid = scope.bid;
                PlayGameFactory.continue(update);
                PlayGameFactory.setPlantToBidOn(null);
                scope.justPicked = true;
            };

            scope.$watch('auction', function(newVal, oldVal){
                if(newVal) scope.justPicked = false;
            });

            scope.getAuction = function(){
                scope.auction = PlayGameFactory.getAuction();
                scope.auctionPlant = scope.auction && scope.auction.plant;
                return scope.auction;
            }

            scope.bidFor = function(bid){
                update.player = PlayGameFactory.getMe();
                update.data.plant = scope.auction.plant;
                update.data.bid = bid;
                PlayGameFactory.continue(update);
            }

            scope.hideAuction = function() {
                return [
                    !PlayGameFactory.iAmActivePlayer(),
                    !PlayGameFactory.getAuction()
                ].every(valid => valid);
            }

            scope.shouldSeeBidButtons = function(){
                return [
                    PlayGameFactory.iAmActiveAuctionPlayer(),
                    PlayGameFactory.iAmActivePlayer && !Boolean(PlayGameFactory.getAuction())
                ].some(valid => valid);
            }

            scope.shouldSeeAuctionButtons = function(){
                return [
                    PlayGameFactory.iAmActiveAuctionPlayer(),
                    Boolean(PlayGameFactory.getAuction())
                ].every(valid => valid);
            }
            scope.turnIsOne = function() {
                return PlayGameFactory.getTurn() === 1;
            }
        }
    }
});
