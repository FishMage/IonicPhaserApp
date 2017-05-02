(function() {
'use strict';

    angular
        .module('App')
        .controller('TinderController', TinderController);

    TinderController.$inject = ['$scope', 'TinderPlay'];
    function TinderController($scope, TinderPlay) {
        
        $scope.tinder = {
            width: "100%",
			height: "100%",
			renderer: Phaser.AUTO,
            transparent: true,
            state: TinderPlay,
			loadPath: "res/tinder/"
        };
        
        var cardsCopy = [
            { image: 'img/dragon.png' },
            { image: 'img/signature.png' },
            { image: 'img/starwars.png' },
            { image: 'img/photo.png' },
            { image: 'img/tinder.png' }
        ];
        
        $scope.fillCards = function(){
            setTimeout(function(){
                $scope.cards = Array.prototype.slice.call(cardsCopy, 0);
                $scope.$apply();
                
                $scope.tinder.instance.state.getCurrentState().stop();
            }, 4000);
        };
        
        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            
            if(!$scope.cards.length){
                $scope.tinder.instance.state.getCurrentState().play();
                $scope.fillCards();
            }
        };
        
        $scope.cardSwipedLeft = function(index) {
            var card = $scope.cards[index];
            $scope.tinder.instance.state.getCurrentState().dislike();
        };
        $scope.cardSwipedRight = function(index) {
            var card = $scope.cards[index];
            $scope.tinder.instance.state.getCurrentState().like();
        };
        
        $scope.$on('$ionicView.enter', function () {
			$scope.cards = [];
            $scope.fillCards();
		});
    }
})();