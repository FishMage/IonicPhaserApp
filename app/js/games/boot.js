(function(Phaser) {
	'use strict';

	angular
		.module('App')
		.factory('DefaultBoot', DefaultBoot);

	DefaultBoot.$inject = [];
	function DefaultBoot() {

		var state = {
			init: function() {
				this.game.stage.backgroundColor = '#444444';
				this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
				this.game.stateTransition.configure({
					duration: Phaser.Timer.SECOND * 0.8,
					ease: Phaser.Easing.Exponential.InOut,
					properties: {
						alpha: 0,
						scale: {
							x: 1.4,
							y: 1.4
						}
					}
				});

				this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			},
			preload: function() {
				this.game.load.image('loading', 'assets/loading.png');
				this.game.load.image('loadingborder', 'assets/loadingborder.png');
			},
			create: function() {

				this.game.state.start('load');
			}
		};

		return state;
	}
})(Phaser);