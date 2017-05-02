/**
* @author       Juan David Nicholls Cardona <jdnichollsc@hotmail.com>
* @copyright    2016 Juan David Nicholls Cardona
* @license      {@link http://choosealicense.com/licenses/no-license/|No License}
* @version      1.0.0 - 2016-04-05
*/

/**
 * The IonPhaser plugin.
 * 
 * With this Angular directive you can integrate Phaser Framework with Ionic.
 *
 */
(function (Phaser) {
	'use strict';

	angular
		.module('App')
		.directive('ionPhaser', ionPhaser);

	ionPhaser.$inject = ['$ionicHistory', '$timeout'];
	function ionPhaser($ionicHistory, $timeout) {

		return {
			restrict: 'E',
			replace: true,
			scope: {
				game: "="
			},
			template: '<div></div>',
			controller: ['$scope', '$element', function ($scope, $element) {
				var self = this;

                /**
                * @property {Boolean} initialized - To initialize the plugin manually.
                * @protected
                */
				self.initialized = false;
                
                /**
                * @property {String} currentState - The current state name.
                * @protected
                */
				self.currentState = $ionicHistory.currentStateName();
                
                /**
                 * Initialize the plugin with the 'game' properties.
                 *
                 * The 'game' Object is created from the view Angular Controller.
                 * 
                 */
				self.initialize = function () {
                    
                    if($scope.game.state && $scope.game.loadPath && !$scope.game.state.ionPhaserRealPreload){
                        $scope.game.state.ionPhaserRealPreload = $scope.game.state.preload;
                        $scope.game.state.preload = function () {
                            this.game.load.path = $scope.game.loadPath;
                            this.ionPhaserRealPreload();
                        };
                    }
                    
					$scope.game.instance = new Phaser.Game($scope.game.width,
						$scope.game.height,
						$scope.game.renderer,
						$scope.game.parent || $element[0],
						$scope.game.state,
						$scope.game.transparent,
						$scope.game.antialias,
						$scope.game.physicsConfig);

					if ($scope.game.states) {
						for (var i = 0; i < $scope.game.states.length; i++) {
							var currentState = $scope.game.states[i];
							if ($scope.game.loadPath && currentState.state.preload && !currentState.state.ionPhaserRealPreload) {

								currentState.state.ionPhaserRealPreload = currentState.state.preload;
								currentState.state.preload = function () {
									this.game.load.path = $scope.game.loadPath;
									this.ionPhaserRealPreload();
								};
							}
							$scope.game.instance.state.add(currentState.name, currentState.state);
						}
						$scope.game.instance.state.start($scope.game.initState);
					}
				};
                
                /**
                 * Create a new Phaser instance when the initialized property change to 'true'
                 *
                 */
				$scope.$watch("game.initialize", function (initialize) {
					if (initialize !== false && !self.initialized) {
						self.initialized = true;
						self.initialize();
					}
				});

                /**
                 * Create a new Phaser instance when Ionic navigate to the parent view.
                 *
                 */
				$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
					if (toState.name == self.currentState && toState.cache !== false && self.initialized) {
						self.initialize();
					}
				});

                /**
                 * Destroy the canvas when Ionic navigate to other view.
                 *
                 */
				$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
					var seconds = 450;
                    if (toState.nativeTransitions && toState.nativeTransitions.duration) {
                        seconds = toState.nativeTransitions.duration;
                    }
                    if(seconds){
                        $scope.game.instance.paused = true;
                        $timeout(function () {
                            $scope.game.instance.destroy();
                        }, seconds);
                    }else{
                        $scope.game.instance.destroy();
                    }
				});
			}]
		};

	}
})(Phaser);