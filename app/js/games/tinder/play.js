(function(Phaser) {
'use strict';

    angular
        .module('App')
        .factory('TinderPlay', TinderPlay);

    //TinderPlay.$inject = [];
    function TinderPlay() {
        
        var state = {
            init: function() {
				//this.stage.backgroundColor = 0xffffff;
				this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.updateLayout();
			},
            preload: function () {
                this.load.image('ionphaser', 'assets/ionphaser.png');
                this.load.image('like', 'assets/like.png');
                this.load.image('dislike', 'assets/dislike.png');
            },
            create: function() {
                
                this.graphic = this.game.make.graphics(0, 0);
                this.graphic.lineStyle(1, 0xFF6B6B, 1);
                this.graphic.beginFill(0xFF6B6B, 0.8);
                this.graphic.drawCircle(0, 0, 500);
                this.graphic.endFill();
                
                this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ionphaser');
                this.logo.anchor.set(0.5);
                
                this.game.add.tween(this.logo.scale).to( { x: 0, y: 0 }, 300, "Back.easeIn", true, 800);
                
                this.animate = this.game.time.events.loop(1500, this.createNewCircle, this);
                this.circles = this.game.add.group();
                
                this.emitterLike = this.game.add.emitter(0, this.game.height, 500);
                this.emitterLike.makeParticles('like');
                this.emitterLike.setRotation(0, 0);
                this.emitterLike.setAlpha(0.1, 1, 3000);
                this.emitterLike.setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
                this.emitterLike.gravity = -200;
                
                this.emitterDisLike = this.game.add.emitter(0, 0, 500);
                this.emitterDisLike.makeParticles('dislike');
                this.emitterDisLike.setRotation(0, 0);
                this.emitterDisLike.setAlpha(0.1, 1, 3000);
                this.emitterDisLike.setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
                this.emitterDisLike.gravity = 200;
            },
            createNewCircle : function () {
                var circle1 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.graphic.generateTexture());
                circle1.anchor.set(0.5);
                circle1.scale.set(0.15);
                circle1.alpha = 0.5;
                this.circles.add(circle1);
                
                var circle2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.graphic.generateTexture());
                circle2.anchor.set(0.5);
                circle2.scale.set(0);
                circle2.alpha = 0.2;
                this.circles.add(circle2);
                
                //circle1.tint = Math.random() * 0xffffff;
                
                this.game.add.tween(circle1.scale).to( { x: 3, y: 3 }, 4000, "Linear", true);
                this.game.add.tween(circle2.scale).to( { x: 2.8, y: 2.8 }, 4000, "Linear", true);
                
                this.game.add.tween(circle1).to( { alpha: 0 }, 1000, "Linear", true);
                this.game.add.tween(circle2).to( { alpha: 0 }, 1500, "Linear", true);
            },
            play: function () {
                this.circles = this.game.add.group();
                this.createNewCircle();
                this.animate.timer.start();
            },
            stop: function () {
                this.circles.removeAll(true);
                this.animate.timer.stop(false);
            },
            like: function(){
                this.emitterLike.emitX = this.game.rnd.integerInRange(0, this.game.width);
                this.emitterLike.start(true, 5000, null, 26);
            },
            dislike: function () {
                this.emitterDisLike.emitX = this.game.rnd.integerInRange(0, this.game.width);
                this.emitterDisLike.start(true, 5000, null, 26);
            }
        };
        
        return state;
    }
})(Phaser);