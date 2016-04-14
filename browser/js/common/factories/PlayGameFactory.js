app.factory('PlayGameFactory', function ($http, FirebaseFactory, $uibModal, $q) {
  var baseUrl = '/api/play/continue/',
    chooseUrl = '/api/play/choose/',
    user,
    gridId,
    gridKey,
    grid,
    me,
    plantToBidOn,
    wishlist = {
      coal: 0,
      oil: 0,
      trash: 0,
      nuke: 0
    },
    resourcesForHybrids = {
      coal: 0,
      oil: 0
    };

  function toData(response) {
    return response.data;
  }

  var PGFactory = {};

  PGFactory.continue = function (update) {
    if(grid.name === 'tour') return $q.resolve({});
    return $http.post(baseUrl + gridId, update)
      .then(toData);
  };


  PGFactory.choose = function (update) {
    return $http.post(chooseUrl + gridId, update)
      .then(toData);
  }

  PGFactory.setGridId = function (_gridId) {
    gridId = _gridId;
  };

  PGFactory.setKey = function (_gridKey) {
    gridKey = _gridKey;
  };

  PGFactory.getKey = function () {
    return gridKey;
  };

  PGFactory.setUser = function (userPromise) {
    userPromise.then(function (_user) {
      user = _user;
    });
  };

  PGFactory.getGrid = function () {
    if (gridKey) grid = FirebaseFactory.getConnection(gridKey);
    return grid;
  };

  PGFactory.setGrid = function(g) {
    grid = g;
  }

  PGFactory.getGame = function () {
    if (grid && grid.game) return grid.game;
  }

  PGFactory.getMe = function () {
    if (grid && grid.players) {
      if(grid.name === 'tour') return me = grid.players[0];
      var players = grid.players;
      for (var i = 0, len = players.length; i < len; i++) {
        if (players[i].user._id === user._id) return me = players[i];
      }
    }
    return null;
  };

  PGFactory.getTurnOrder = function () {
    if (grid && grid.game) {
      return grid.game.turnOrder;
    }
  };

  PGFactory.getActivePlayer = function () {
    if (grid && grid.state) {
      return grid.state.activePlayer;
    }
  };

  PGFactory.getPlantMarket = function () {
    if (grid && grid.game) return grid.game.plantMarket;
  };

  PGFactory.getResourceMarket = function () {
    if (grid && grid.game) return grid.game.resourceMarket;
  };

  PGFactory.setPlantToBidOn = function (plant) {
    plantToBidOn = plant;
  };

  PGFactory.getPlantToBidOn = function () {
    return plantToBidOn;
  };

  PGFactory.getGamePhase = function () {
    if (grid && grid.state) {
      if (grid.state.auction && grid.state.auction.choice) {
        return "plantDiscard";
      }
      else return grid.state.phase;
    }
  };

  PGFactory.iAmActivePlayer = function () {
    var me = PGFactory.getMe();
    if (me) return me._id === PGFactory.getActivePlayer()._id;
  };

  PGFactory.iAmActiveAuctionPlayer = function () {
    var auction = PGFactory.getAuction();
    if (auction) return auction.activePlayer._id === PGFactory.getMe()._id;
  }

  PGFactory.getWaitingOnPlayer = function () {
    var auction = PGFactory.getAuction();
    if (auction) {
      if (auction.choice) {
        if (PGFactory.iAmActiveDiscarder()) return null;
        return auction.choice.player.user.username;
      }
      if (PGFactory.iAmActiveAuctionPlayer()) return null;
      return auction.activePlayer.user.username;
    }
    if (PGFactory.iAmActivePlayer() && !PGFactory.getAuction()) return null;
    var activePlayer = PGFactory.getActivePlayer();
    if (activePlayer) return activePlayer.user.username;
  }

  PGFactory.iAmActiveDiscarder = function () {
    var auction = PGFactory.getAuction();
    if (auction && auction.choice) {
      return auction.choice.player._id === PGFactory.getMe()._id;
    }
  }

  PGFactory.getActiveDiscarder = function () {
    var auction = PGFactory.getAuction();
    if (auction) return auction.choice.player;
  }

  PGFactory.getAuction = function () {
    if (grid && grid.state) return grid.state.auction;
  };

  PGFactory.changeWishlist = function (resourceType, quantity) {
    wishlist[resourceType] += +quantity;
  }

  PGFactory.getWishlist = function () {
    return wishlist;
  }

  PGFactory.getResourcesToUseForHybrids = function () {
    return resourcesForHybrids;
  }

  PGFactory.changeResourcesToUseForHybrids = function (resourceType, quantity) {
    resourcesForHybrids[resourceType] += quantity;
  }

  PGFactory.clearResourcesToUseForHybrids = function () {
    resourcesForHybrids = {
      oil: 0,
      coal: 0
    };
  }

  PGFactory.clearWishlist = function () {
    wishlist = {
      coal: 0,
      oil: 0,
      trash: 0,
      nuke: 0
    };
  }

  PGFactory.getMyPlants = function () {
    return PGFactory.getMe().plants;
  }

  PGFactory.getMyCities = function () {
    return PGFactory.getMe().cities;
  }

  PGFactory.getMyResources = function () {
    return PGFactory.getMe().resources;
  }

  PGFactory.getDeckSize = function() {
    if(grid && grid.game) return grid.game.plantDeck.length;
  }

  PGFactory.getStepThreePlants = function() {
    if(grid && grid.game) return grid.game.stepThreePlants;
  }

  PGFactory.getDiscardedPlants = function() {
    if(grid && grid.game) return grid.game.discardedPlants;
  }

  PGFactory.getTurn = function () {
    var game = PGFactory.getGame();
    if (game) return game.turn;
  }

  PGFactory.getStep = function () {
    var game = PGFactory.getGame();
    if (game) return game.step;
  }

  PGFactory.gameIsComplete = function(){
    var game = PGFactory.getGame();
    if (game) return game.complete;
  };

  PGFactory.getRestock = function(resource) {
    if(grid && grid.game) return grid.game.restockRates[resource];
  }

  PGFactory.openGameEndModal = function(gameIsComplete) {
    if(gameIsComplete) {
      $uibModal.open({
        animation: true,
        templateUrl: 'js/common/modals/gameEndModal/gameEndModal.html',
        controller: 'GameEndModalCtrl',
        size: 'md',
        backdrop: 'static',
        keyboard: 'false',
        resolve: {
          players: function(){
            return PGFactory.getTurnOrder();
          }
        }
      });
    }
  }

  return PGFactory;

});
