app.directive('plantAndResourcePanel', function(SliderFactory, PlayGameFactory, $uibModal){
    return {
        restrict: "E",
        templateUrl: "js/common/directives/plantAndResourcePanel/plantAndResourcePanel.html",
        scope: {
            player: '=',
            auction: '=',
            players: '='
        },
        link: function(scope, elem, attrs){   
            
            scope.getPlantMarket = PlayGameFactory.getPlantMarket;
            scope.getResourceMarket = PlayGameFactory.getResourceMarket;
            scope.plantsTrueResourcesFalse = true;
            scope.open = SliderFactory.slideOut.bind(null, 'plant');
            scope.toggleArrows = SliderFactory.toggleSliderArrowsHandler();
            
            scope.changeView = function(view){
                var viewObj = {
                    plants: true,
                    resources: false
                };
                scope.plantsTrueResourcesFalse = viewObj[view];
            }
            scope.firstFour = function(index){
                if(index < 4) return 1;
                return .5;
            } 
            scope.resourceColors = {
                coal: '#C8824D',
                oil: 'black',
                trash: '#A8A818',
                nuke: 'red'
            };
            scope.buyResources = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/common/directives/resourceModal/resourceModal.html',
                    controller: 'ResourceModalCtrl',
                    size: undefined,
                    resolve: {
                        resources: function () {
                            return scope.resources;
                        },
                        resourceColors: function () {
                            return scope.resourceColors;
                        },
                        player: function(){
                            return scope.player;
                        }

                    }
                });
            };
            scope.bidFor = function (plant) {
              var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/common/directives/bidModal/bidModal.html',
                    controller: 'BidModalCtrl',
                    size: 'lg',
                    resolve: {
                      plant: function () {
                        return plant;
                      },
                      player: function(){
                        return scope.player;      
                      },
                      auction: function(){
                        return scope.auction;
                      },
                      players: function(){
                        return scope.players;
                      }
                    }
                });   
            };
        }
    }
})