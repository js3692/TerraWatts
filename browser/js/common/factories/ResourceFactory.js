app.factory('ResourceFactory', function (PlayGameFactory) {
    var ResourceFactory = {};


    function priceOfOne(resourceType, market) {
        var amount = market[resourceType];
        if (resourceType === 'nuke') {
            if (amount < 5) {
                return 18 - 2*amount;
            } else {
                return 13 - amount;
            }
        } else {
            return 8 - Math.floor((amount-1)/3);
        }
    };

    ResourceFactory.getTotalResourcePrice = function() {
        var marketCopy = angular.copy(PlayGameFactory.getResourceMarket());
        var wishlist = PlayGameFactory.getWishlist();

        var total = 0;
        for(var resource in wishlist) {
            for(var i = 0; i < wishlist[resource]; i++) {
                total += priceOfOne(resource, marketCopy);
                marketCopy[resource]--;
            }
        }
        return total;
    };

    return ResourceFactory;
})
