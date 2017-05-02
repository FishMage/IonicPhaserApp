(function(Phaser) {
'use strict';

	angular
		.module('App')
		.factory('StarWarsPlay', StarWarsPlay);

	//StarWarsPlay.$inject = [];
	function StarWarsPlay() {
		
		var state = {
            init: function() {
				this.stage.backgroundColor = 0xffffff;
				this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.updateLayout();
			},
            preload: function(){
                this.load.image('logo', 'assets/logo.png');
                this.game.load.audio('starwars', ['audio/star-wars-theme.mp3']);  
            },
			create: function () {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                
                this.starwars = this.add.audio('starwars');
                this.starwars.volume = 0.7;
				//this.starwars.loop = true;
                
                this.showIntro();
			},
            showIntro: function(){
                this.currentText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "A long time ago, in a galaxy\nfar far away...", {
                    font: '40px "Arial"',
                    fill: "rgb(75, 213, 238)",
                    wordWrap: true, 
                    wordWrapWidth: this.game.width,
                    align: "center"
                });
                this.currentText.alpha = 0;
                this.currentText.anchor.set(0.5);
                this.tween = this.game.add.tween(this.currentText).to( { alpha: 1 }, 400, "Linear", true);
                this.game.time.events.add(Phaser.Timer.SECOND * 1.5, this.decodeAudio, this).autoDestroy = true;
            },
            decodeAudio: function(){
                this.game.sound.setDecodedCallback([ this.starwars ], this.hideIntro, this);  
            },
            hideIntro: function(){
                this.tween.to( { alpha: 0 }, 1500, "Linear", true);
                this.tween.onComplete.addOnce(this.showLogo, this);
            },
            showLogo: function () {
                this.starwars.play();
                this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
                this.logo.anchor.set(0.5);
                this.logo.scale.set(2);
                this.tween = this.game.add.tween(this.logo).to( { alpha: 0 }, 400, "Linear");
                this.game.add.tween(this.logo.scale).to( { x: 0.05, y: 0.05 }, 8000, Phaser.Easing.Linear.InOut, true).chain(this.tween);
                this.tween.onComplete.add(this.show3DHistory, this);
            },
            show3DHistory: function(){
                this.game.parent.className += "starwars3D";
                
                this.title = this.game.add.text(this.game.world.centerX, this.game.world.height, "Episode IV\nA NEW HOPE", {
                    font: '60px "Arial"',
                    fill: "#ff6",
                    wordWrap: true, 
                    wordWrapWidth: this.game.width,
                    align: "center"
                });
                this.title.anchor.setTo(0.5, 0);
                this.title.addFontWeight('normal', 0);
                this.title.addFontWeight('bold', 10);
                
                this.game.physics.enable(this.title, Phaser.Physics.ARCADE);
                this.title.body.velocity.y = -30;
                this.title.checkWorldBounds = true;
                this.title.outOfBoundsKill = true;
                
                this.currentText.setStyle({
                    font: '700 44px "Arial"',
                    fill: "#ff6",
                    wordWrap: true,
                    wordWrapWidth: this.game.width
                });
                this.currentText.position.y = this.game.world.height + this.title.height + 20;
                this.currentText.anchor.y = 0;
                this.currentText.alpha = 1;
                this.currentText.setText("It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.\n\nDuring the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet.\n\nPursued by the Empire's sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy....");
                                
                this.game.physics.enable(this.currentText, Phaser.Physics.ARCADE);
                this.currentText.body.velocity.y = -30;
                
                this.currentText.checkWorldBounds = true;
                this.currentText.beforeToAppear = true;
                this.currentText.events.onOutOfBounds.add(this.showEnd, this);
            },
            showEnd: function () {
                if(!this.currentText.beforeToAppear){
                    this.currentText.kill();
                    this.game.parent.className = "";
                    this.logo.y = -50;
                    this.logo.alpha = 1;
                    this.logo.scale.set(1);
                    var scale = this.game.width / this.logo.width;
                    this.logo.width = this.game.width;
                    this.logo.height *= scale;
                    this.game.add.tween(this.logo).to( { y: this.game.world.centerY }, 2400, Phaser.Easing.Bounce.Out, true);
                };
                this.currentText.beforeToAppear = !this.currentText.beforeToAppear;
            }
		};
		
		return state;
	}
})(Phaser);