app.factory('CityCartFactory', function($rootScope) {
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
        $rootScope.$digest();
        
    };
    
    CCFactory.getCart = function(){
        return cityCart;
    };
    
	return CCFactory;
})