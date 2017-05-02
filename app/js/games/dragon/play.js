(function(Phaser) {
	'use strict';

	angular
		.module('App')
		.factory('DragonPlay', DragonPlay);

	DragonPlay.$inject = ['$cordovaVibration'];
	function DragonPlay($cordovaVibration) {

		var state = {
			create: function() {

				//Load image data from cache
				var imgCache = null;

				this.background = this.add.image(0, 0, this.createBg());

				this.moon = this.add.image(this.game.world.centerX, 100, 'moon');
				this.moon.anchor.set(0.5);

				this.clouds = this.add.group();

				imgCache = this.cache.getFrame('cloud1');
				this.cloud1 = this.add.tileSprite(0, -10, imgCache.width, imgCache.height, 'cloud1');
				this.cloud1.autoScroll(-40, 0);
				this.cloud1.imgCache = imgCache;
				this.cloud1.alpha = 0.5;
				this.clouds.add(this.cloud1);

				imgCache = this.cache.getFrame('cloud2');
				this.cloud2 = this.add.tileSprite(0, -10, imgCache.width, imgCache.height, 'cloud2');
				this.cloud2.autoScroll(-30, 0);
				this.cloud2.imgCache = imgCache;
				this.cloud2.alpha = 0.5;
				this.clouds.add(this.cloud2);

				imgCache = this.cache.getFrame('cloud3');
				this.cloud3 = this.add.tileSprite(0, -10, imgCache.width, imgCache.height, 'cloud3');
				this.cloud3.autoScroll(-50, 0);
				this.cloud3.imgCache = imgCache;
				this.clouds.add(this.cloud3);

				this.scaleClouds(this.game.width, this.game.height);

				this.emitter = this.game.add.emitter(this.game.world.centerX, -100, 300);
				this.emitter.width = this.game.world.width;
				this.emitter.angle = 5;
				this.emitter.makeParticles('raindrop');
				this.emitter.minParticleScale = 0.7;
				this.emitter.maxParticleScale = 1;
				this.emitter.setYSpeed(600, 800);
				this.emitter.setXSpeed(-5, 5);
				this.emitter.minRotation = 0;
				this.emitter.maxRotation = 0;
				this.emitter.start(false, 1600, 2, 0);

				this.createDragon();

				this.lightningBitmap = this.game.add.bitmapData(200, 1000);
				this.lightning = this.game.add.image(this.game.width / 2, 0, this.lightningBitmap);
				this.lightning.anchor.setTo(0.5, 0);

				this.flash = this.game.add.graphics(0, -10);
				this.flash.beginFill(0xffffff, 1);
				this.flash.drawRect(0, 0, this.game.width, this.game.height + 20);
				this.flash.endFill();
				this.flash.alpha = 0;

				this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

				this.thunder = this.add.audio('thunder');
				this.dragonRoar = this.add.audio('dragon');
				this.rain = this.add.audio('rain');
				this.rain.loop = true;
				this.rain.play();
			},
			createDragon: function() {
				var points = [];
				var imgCache = this.game.cache.getFrame('dragon');
				var length = imgCache.width / 20;
				for (var i = 0; i < 20; i++) {
					points.push(new Phaser.Point(i * length, 0));
				}
				this.dragon = this.game.add.rope(-imgCache.width, this.game.world.centerY, 'dragon', null, points);
				this.dragon.aditionalInfo = {
					count: 0,
					direction: 'right',
					roar: true
				};
				this.dragon.updateAnimation = function() {
					this.aditionalInfo.count += 0.1;
					for (var i = 0; i < this.points.length; i++) {
						this.points[i].y = Math.sin(i * 0.3 + this.aditionalInfo.count) * 10;
					}
				};
			},
			launchLightning: function() {

				try {
					$cordovaVibration.vibrate(300);
				} catch (exc) { }

				this.thunder.play();

				this.lightning.x = this.rnd.integerInRange(0, this.game.width);

				var randomPosition = {
					x: this.rnd.integerInRange(0, this.game.width),
					y: this.rnd.integerInRange(this.game.height / 2, this.game.height)
				};

				this.lightning.rotation =
					this.game.math.angleBetween(
						this.lightning.x, this.lightning.y,
						randomPosition.x, randomPosition.y
					) - Math.PI / 2;

				var distance = this.game.math.distance(
					this.lightning.x, this.lightning.y,
					randomPosition.x, randomPosition.y
				);

				this.createLightningTexture(this.lightningBitmap.width / 2, 0, 20, 3, false, distance);

				this.lightning.alpha = 1;

				this.game.add.tween(this.lightning)
					.to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
					.to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
					.to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
					.to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
					.to({ alpha: 0 }, 250, Phaser.Easing.Cubic.In)
					.start();

				this.flash.alpha = 1;
				this.game.add.tween(this.flash)
					.to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In, true);

				//this.game.camera.y = 0;
				//this.game.add.tween(this.game.camera).to({ y: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);
			},
			createLightningTexture: function(x, y, segments, boltWidth, branch, distance) {
				var ctx = this.lightningBitmap.context;
				var width = this.lightningBitmap.width;
				var height = this.lightningBitmap.height;

				if (!branch) ctx.clearRect(0, 0, width, height);

				for (var i = 0; i < segments; i++) {

					ctx.strokeStyle = 'rgb(255, 255, 255)';
					ctx.lineWidth = boltWidth;

					ctx.beginPath();
					ctx.moveTo(x, y);

					if (branch) {
						x += this.game.rnd.integerInRange(-10, 10);
					} else {
						x += this.game.rnd.integerInRange(-30, 30);
					}
					if (x <= 10) x = 10;
					if (x >= width - 10) x = width - 10;

					if (branch) {
						y += this.game.rnd.integerInRange(10, 20);
					} else {
						y += this.game.rnd.integerInRange(20, distance / segments);
					}
					if ((!branch && i == segments - 1) || y > distance) {
						y = distance;
						if (!branch) x = width / 2;
					}

					ctx.lineTo(x, y);
					ctx.stroke();

					if (y >= distance) break;

					if (!branch) {
						if (Phaser.Utils.chanceRoll(20)) {
							this.createLightningTexture(x, y, 10, 1, true, distance);
						}
					}
				}

				this.lightningBitmap.dirty = true;
			},
			createBg: function() {
				var myBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
				var grd = myBitmap.context.createLinearGradient(0, 0, 0, this.game.height);
				grd.addColorStop(0, "#333");
				grd.addColorStop(1, "#000");
				myBitmap.context.fillStyle = grd;
				myBitmap.context.fillRect(0, 0, this.game.width, this.game.height);

				return myBitmap;
			},
			scaleClouds: function(width, height) {
				this.clouds.forEach(function(cloud) {

					if (width > cloud.imgCache.width) {
						cloud.scale.x = width / cloud.imgCache.width;
					}
					else {
						cloud.scale.x = 1;
					}
					cloud.scale.y = height / cloud.imgCache.height;
				});
			},
			update: function() {

				if (this.dragon.aditionalInfo.roar &&
					this.dragon.x > this.game.world.centerX - 100 &&
					this.dragon.x < this.game.world.centerX + 100) {
					this.dragon.aditionalInfo.roar = false;
					this.dragonRoar.play();
				}

				if (this.dragon.aditionalInfo.direction == 'right') {
					this.dragon.x += 3;

					if (this.dragon.x > this.game.width + 600) {
						this.dragon.aditionalInfo.direction = 'left';
						var randomScale = this.game.rnd.realInRange(0.8, 1.4);
						this.dragon.scale.setTo(-randomScale, randomScale);
						this.dragon.y = this.game.rnd.integerInRange(this.world.centerY - this.world.centerY / 2, this.world.centerY + this.world.centerY / 2);
						this.dragon.aditionalInfo.roar = true;
					}
				}
				if (this.dragon.aditionalInfo.direction == 'left') {
					this.dragon.x -= 3;

					if (this.dragon.x < -600) {
						this.dragon.aditionalInfo.direction = 'right';
						var randomScale = this.game.rnd.realInRange(0.8, 1.4);
						this.dragon.scale.setTo(randomScale, randomScale);
						this.dragon.y = this.game.rnd.integerInRange(this.world.centerY - this.world.centerY / 2, this.world.centerY + this.world.centerY / 2);
						this.dragon.aditionalInfo.roar = true;
					}
				}
			},
			resize: function(width, height) {
				this.game.world.setBounds(-10, -10, width + 20, height + 20);
				this.emitter.width = this.flash.width = width;
				this.emitter.x = this.emitter.width / 2;

				this.moon.x = width / 2;

				this.background.width = width;
				this.background.height = height;

				this.scaleClouds(width, height);

			}
		};

		return state;
	}
})(Phaser);