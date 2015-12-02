app.directive('plantPanel', function(SliderFactory, $uibModal){
    return {
        restrict: "E",
        templateUrl: "js/common/directives/plantPanel/plantPanel.html",
        scope: {
            plantMarket: '=',
            resources: '=',
            player: '='
        },
        link: function(scope, elem, attrs){   
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
                    size: 'sm',
                    resolve: {
                        resources: function () {
                            return scope.resources;
                        },
                        resourceColors: function () {
                            return scope.resourceColors;
                        }

                    }
                });
            };
            
            scope.bidFor = function (plant) {
              var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/common/directives/bidModal/bidModal.html',
                    controller: 'BidModalCtrl',
                    size: 'sm',
                    resolve: {
                      plant: function () {
                        return plant;
                      },
                      player: function(){
                        return scope.player;      
                      }
                    }
                });   
            };
        }
    }
})