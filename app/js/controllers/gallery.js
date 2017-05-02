(function(Phaser) {
'use strict';

	angular
		.module('App')
		.controller('GalleryController', GalleryController);

	GalleryController.$inject = ['$scope', '$interval', '$timeout'];
	function GalleryController($scope, $interval, $timeout) {
		
		$scope.states = [
			{
				"title": "Dragon",
				"img": "img/dragon.png",
				"state": "app.dragon"
			},
			{
				"title": "Signature",
				"img": "img/signature.png",
				"state": "app.signature"
			},
			{
				"title": "Star Wars",
				"img": "img/starwars.png",
				"state": "app.starwars"
			},
			{
				"title": "Photo",
				"img": "img/photo.png",
				"state": "app.photo"
			},
            {
                "title": "Tinder",
                "img": "img/tinder.png",
                "state": "app.tinder"
            },
            {
                "title": "Flappy Bird",
                "img": "img/flappybird.png",
                "state": "app.flappybird"
            }
		];
        
        function CreateArrayRandom() {
            $scope.animateNumbers = Phaser.ArrayUtils.numberArray(0, $scope.states.length - 1);
            $scope.animateNumbers.sort(function () {
                return Math.random() - 0.5;
            });
        }
        
        $scope.$on('$ionicView.afterEnter', function () {
            
            CreateArrayRandom();
            
			$scope.currentInterval = $interval(function () {
            
                var position = $scope.animateNumbers.pop();
                if(position === undefined){
                    CreateArrayRandom();
                    position = $scope.animateNumbers.pop();
                }
                var currentStateAnimate = $scope.states[position];                
                currentStateAnimate.selected = true;
                $timeout(function(){
                    currentStateAnimate.selected = false;
                }, 3000);
            }, 4000);
		});
        
        $scope.$on('$ionicView.afterLeave', function () {
            $interval.cancel($scope.currentInterval);
        });
	}
})(Phaser);