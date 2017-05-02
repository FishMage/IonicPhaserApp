(function(Phaser) {
	'use strict';

	angular
		.module('App')
		.controller('DragonController', DragonController);

	DragonController.$inject = ['$scope', 'DragonGame', '$ionicSideMenuDelegate'];
	function DragonController($scope, DragonGame, $ionicSideMenuDelegate) {

		$scope.game = {
			width: "100%",
			height: "100%",
			renderer: Phaser.AUTO,
			states: [{
				name: "boot",
				state: angular.copy(DragonGame.Boot)
			},
				{
					name: "load",
					state: angular.copy(DragonGame.Load)
				},
				{
					name: "play",
					state: angular.copy(DragonGame.Play)
				}],
			initState: "boot",
			loadPath: "res/dragon/"
			//initialize: false
		};
        
        $scope.$watch(function () {
            return $ionicSideMenuDelegate.getOpenRatio();
        }, function (ratio) {
            if ($scope.game.instance) {
                if (ratio == 1) {
                    $scope.game.instance.paused = true;
                }
                if (ratio == 0) {
                    $scope.game.instance.paused = false;
                }
            }
        });

		$scope.flash = function() {
			//Call a Method from a state of the game
			$scope.game.instance.state.getCurrentState().launchLightning();
		};
	}
})(Phaser);