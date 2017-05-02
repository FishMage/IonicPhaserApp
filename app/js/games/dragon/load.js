(function() {
	'use strict';

	angular
		.module('App')
		.factory('DragonLoad', DragonLoad);

	//DragonLoad.$inject = [];
	function DragonLoad() {

		var state = {
			preload: function() {
				this.loadingborder = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 15, 'loadingborder');
				this.loadingborder.x -= this.loadingborder.width / 2;
				this.loading = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 19, 'loading');
				this.loading.x -= this.loading.width / 2;
				this.game.load.setPreloadSprite(this.loading, 0);

				this.load.image('cloud1', 'assets/cloud1.png');
				this.load.image('cloud2', 'assets/cloud2.png');
				this.load.image('cloud3', 'assets/cloud3.png');
				this.load.image('raindrop', 'assets/raindrop.png');
				this.load.image('dragon', 'assets/dragon.png');
				this.load.image('moon', 'assets/moon.png');

				//Credits
				//http://soundbible.com/576-Barrel-Exploding.html
				//Recorded by BlastwaveFx.com
				//Barrel Exploding
				this.game.load.audio('thunder', ['audio/thunder.ogg', 'audio/thunder.mp3']);

				//Credits
				//http://soundbible.com/2016-Thunder-Strike-2.html
				//Recorded by Mike Koenig
				//Thunder Strike 2
				this.game.load.audio('rain', ['audio/rain.ogg', 'audio/rain.mp3']);

				this.game.load.audio('dragon', ['audio/dragon.ogg', 'audio/dragon.mp3']);
			},
			create: function() {
				this.game.state.start('play');
			}
		};

		return state;
	}
})();