(function() {
	'use strict';

	angular
		.module('App')
		.factory('SignaturePlay', SignaturePlay);

	//SignaturePlay.$inject = [];
	function SignaturePlay() {

		var state = {
			init: function() {
				this.stage.backgroundColor = 0xffffff;
				//this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				//this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
				//this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                
                //ENABLE DEBUG FPS
				this.game.time.advancedTiming = true;
				this.game.time.desiredFps = 120;

				//Eliminate the delta timer inside Phaser
				this.game.forceSingleUpdate = true;
			},
			preload: function() {
				this.load.image('ionphaser', 'res/signature/assets/ionphaser.png');
			},
			create: function() {
				this.layers = this.add.group();

				this.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
				this.layers.add(this.bmd.addToWorld());

				this.currentOption = 0;
				this.bmd.ctx.lineWidth = 5;
				this.points = [];
				this.isDrawing = false;

				this.game.input.onDown.add(this.startTouch, this);
				this.game.input.addMoveCallback(this.touchMove, this)
				this.game.input.onUp.add(this.endTouch, this);
			},
			update: function() {
				if (this.isDrawing) {

					switch (this.currentOption) {
						case 10:
							this.eleventhOptionMove();
							break;
					}
				}
			},
			touchMove: function() {
				if (this.isDrawing) {

					switch (this.currentOption) {
						case 0:
						case 1:
							this.firstOptionMove();
							break;
						case 2:
							this.thirdOptionMove();
							break;
						case 3:
							this.fourthOptionMove();
							break;
						case 4:
							this.fifthOptionMove();
							break;
						case 5:
							this.sixthOptionMove();
							break;
						case 6:
							this.seventhOptionMove();
							break;
						case 7:
							this.eigthOptionMove();
							break;
						case 8:
							this.ninthOptionMove();
							break;
						case 9:
							this.tenthOptionMove();
							break;
						case 11:
							this.twelfthOptionMove();
							break;
						case 12:
							this.thirteenthOptionMove();
							break;
						case 13:
							this.fourteenthOptionMove();
							break;
						case 14:
							this.fifteenthOptionMove();
							break;
					}

					this.bmd.dirty = true;
				}
			},
			startTouch: function() {
				this.lastPoint = {
					x: this.game.input.x,
					y: this.game.input.y,
					newLine: true
				};

				this.points.push(this.lastPoint);
				this.bmd.ctx.beginPath();

				switch (this.currentOption) {
					case 0:
						this.firstOptionDown();
						break;
					case 1:
						this.secondOptionDown();
						break;
					case 2:
						this.thirdOptionDown();
						break;
					case 3:
						this.fourthOptionDown();
						break;
					case 4:
						this.fifthOptionDown();
						break;
					case 8:
						this.ninthOptionDown();
						break;
					case 9:
						this.tenthOptionDown();
						break;
					case 10:
						this.eleventhOptionDown();
						break;
					case 13:
						this.fourteenthOptionDown();
						break;
				};

				this.bmd.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
				this.isDrawing = true;
			},
			endTouch: function() {
				this.isDrawing = false;
			},
			clearCanvas: function() {
				this.points = [];
				this.layers.removeAll(true);
				this.newLayer();
			},
			getImage: function() {
				return this.game.canvas.toDataURL();
			},
			changeOption: function(position) {
				this.currentOption = position;

				this.newLayer();
			},
			changeLineWidth: function(width) {
				this.newLayer();
				this.bmd.ctx.lineWidth = width;
			},
			firstOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
			},
			firstOptionMove: function() {
				this.bmd.ctx.lineTo(this.game.input.x, this.game.input.y);
				this.bmd.ctx.stroke();
			},
			secondOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
				this.bmd.ctx.shadowBlur = this.bmd.ctx.lineWidth + 3;
				this.bmd.ctx.shadowColor = 'rgb(0, 0, 0)';
			},
			thirdOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
				this.bmd.ctx.shadowBlur = this.bmd.ctx.lineWidth;
				this.bmd.ctx.shadowColor = 'rgb(0, 0, 0)';
			},
			thirdOptionMove: function() {
				this.bmd.ctx.clearRect(0, 0, this.bmd.width, this.bmd.height);
				this.points.push({ x: this.game.input.x, y: this.game.input.y });

				this.bmd.ctx.beginPath();
				this.bmd.ctx.moveTo(this.points[0].x, this.points[0].y);
				for (var i = 1; i < this.points.length; i++) {
					var point = this.points[i];
					if (point.newLine) {
						this.bmd.ctx.moveTo(point.x, point.y);
					} else {
						this.bmd.ctx.lineTo(point.x, point.y);
					}
				}
				this.bmd.ctx.stroke();
			},
			fourthOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'butt';
			},
			fourthOptionMove: function() {
				var currentPoint = {
					x: this.game.input.x,
					y: this.game.input.y
				};

				this.bmd.ctx.beginPath();
				this.bmd.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
				this.bmd.ctx.lineTo(currentPoint.x, currentPoint.y);
				this.bmd.ctx.stroke();

				this.bmd.ctx.moveTo(this.lastPoint.x - this.bmd.ctx.lineWidth / 2, this.lastPoint.y - this.bmd.ctx.lineWidth / 2);
				this.bmd.ctx.lineTo(currentPoint.x - this.bmd.ctx.lineWidth / 2, currentPoint.y - this.bmd.ctx.lineWidth / 2);
				this.bmd.ctx.stroke();


				this.lastPoint = currentPoint;
			},
			fifthOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
			},
			fifthOptionMove: function() {
				var currentPoint = {
					x: this.game.input.x,
					y: this.game.input.y
				};
				this.bmd.ctx.beginPath();

				this.bmd.ctx.globalAlpha = 1;
				this.bmd.ctx.moveTo(this.lastPoint.x - 4, this.lastPoint.y - 4);
				this.bmd.ctx.lineTo(currentPoint.x, currentPoint.y);
				this.bmd.ctx.stroke();

				this.bmd.ctx.globalAlpha = 0.6;
				this.bmd.ctx.moveTo(this.lastPoint.x - 2, this.lastPoint.y - 2);
				this.bmd.ctx.lineTo(currentPoint.x - 2, currentPoint.y - 2);
				this.bmd.ctx.stroke();

				this.bmd.ctx.globalAlpha = 0.4;
				this.bmd.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
				this.bmd.ctx.lineTo(currentPoint.x, currentPoint.y);
				this.bmd.ctx.stroke();

				this.bmd.ctx.globalAlpha = 0.3;
				this.bmd.ctx.moveTo(this.lastPoint.x + 2, this.lastPoint.y + 2);
				this.bmd.ctx.lineTo(currentPoint.x + 2, currentPoint.y + 2);
				this.bmd.ctx.stroke();

				this.bmd.ctx.globalAlpha = 0.2;
				this.bmd.ctx.moveTo(this.lastPoint.x + 4, this.lastPoint.y + 4);
				this.bmd.ctx.lineTo(currentPoint.x + 4, currentPoint.y + 4);
				this.bmd.ctx.stroke();

				this.lastPoint = currentPoint;
			},
			sixthOptionMove: function() {
				this.bmd.ctx.clearRect(0, 0, this.bmd.width, this.bmd.height);
				this.points.push({ x: this.game.input.x, y: this.game.input.y });

				this.stroke(this.offsetPoints(-this.bmd.ctx.lineWidth * 2.6));
				this.stroke(this.offsetPoints(-this.bmd.ctx.lineWidth * 1.2));
				this.stroke(this.points);
				this.stroke(this.offsetPoints(this.bmd.ctx.lineWidth * 1.2));
				this.stroke(this.offsetPoints(this.bmd.ctx.lineWidth * 2.6));
			},
			seventhOptionMove: function() {
				var currentPoint = {
					x: this.game.input.x,
					y: this.game.input.y
				};
				this.bmd.ctx.globalAlpha = Math.random();
				this.bmd.circle(currentPoint.x, currentPoint.y, this.rnd.integerInRange(this.bmd.ctx.lineWidth, this.bmd.ctx.lineWidth + 10), 'red');
			},
			eigthOptionMove: function() {

				var newScale = this.bmd.ctx.lineWidth / 5;
				var img = this.make.image(0, 0, 'ionphaser');
				img.anchor.set(0.5);
				img.scale.set(newScale / 1.2);
				this.bmd.draw(img, this.game.input.x, this.game.input.y);
			},
			ninthOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
			},
			ninthOptionMove: function() {
				var currentPoint = {
					x: this.game.input.x,
					y: this.game.input.y
				};

				this.drawPixels(currentPoint.x, currentPoint.y);
			},
			tenthOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.lineCap = 'round';
			},
			tenthOptionMove: function() {
				var density = 50;

				for (var i = density; i--;) {
					var radius = this.bmd.ctx.lineWidth * 2;
					var offsetX = this.rnd.integerInRange(-radius, radius);
					var offsetY = this.rnd.integerInRange(-radius, radius);
					this.bmd.ctx.fillRect(this.game.input.x + offsetX, this.game.input.y + offsetY, 1, 1);
				}
			},
			eleventhOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
			},
			eleventhOptionMove: function() {
				var currentPoint = {
					x: this.game.input.x,
					y: this.game.input.y
				};
				var density = 40;

				for (var i = density; i--;) {
					var angle = this.game.rnd.realInRange(0, Math.PI * 2);
					var radius = this.game.rnd.realInRange(0, this.bmd.ctx.lineWidth * 4);
					this.bmd.ctx.globalAlpha = Math.random();
					this.bmd.ctx.fillRect(currentPoint.x + radius * Math.cos(angle),
						currentPoint.y + radius * Math.sin(angle),
						this.game.rnd.realInRange(1, 2), this.game.rnd.realInRange(1, 2));
				}
			},
			twelfthOptionMove: function() {

				var tempLineWidth = this.bmd.ctx.lineWidth;
				this.bmd.ctx.lineWidth = this.bmd.ctx.lineWidth / 5;

				this.points.push({ x: this.game.input.x, y: this.game.input.y });

				this.bmd.ctx.beginPath();
				this.bmd.ctx.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
				this.bmd.ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
				this.bmd.ctx.stroke();

				for (var i = 0, len = this.points.length; i < len; i++) {
					var dx = this.points[i].x - this.points[this.points.length - 1].x;
					var dy = this.points[i].y - this.points[this.points.length - 1].y;
					var d = dx * dx + dy * dy;

					if (d < 1000) {
						this.bmd.ctx.beginPath();
						this.bmd.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
						this.bmd.ctx.moveTo(this.points[this.points.length - 1].x + (dx * 0.2), this.points[this.points.length - 1].y + (dy * 0.2));
						this.bmd.ctx.lineTo(this.points[i].x - (dx * 0.2), this.points[i].y - (dy * 0.2));
						this.bmd.ctx.stroke();
					}
				}

				this.bmd.ctx.lineWidth = tempLineWidth;
			},
			thirteenthOptionMove: function() {

				var tempLineWidth = this.bmd.ctx.lineWidth;
				this.bmd.ctx.lineWidth = this.bmd.ctx.lineWidth / 5;

				this.points.push({ x: this.game.input.x, y: this.game.input.y });

				this.bmd.ctx.beginPath();
				this.bmd.ctx.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
				this.bmd.ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
				this.bmd.ctx.stroke();

				for (var i = 0, len = this.points.length; i < len; i++) {
					var dx = this.points[i].x - this.points[this.points.length - 1].x;
					var dy = this.points[i].y - this.points[this.points.length - 1].y;
					var d = dx * dx + dy * dy;

					if (d < 2000 && Math.random() > d / 2000) {
						this.bmd.ctx.beginPath();
						this.bmd.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
						this.bmd.ctx.moveTo(this.points[this.points.length - 1].x + (dx * 0.5), this.points[this.points.length - 1].y + (dy * 0.5));
						this.bmd.ctx.lineTo(this.points[this.points.length - 1].x - (dx * 0.5), this.points[this.points.length - 1].y - (dy * 0.5));
						this.bmd.ctx.stroke();
					}
				}

				this.bmd.ctx.lineWidth = tempLineWidth;
			},
			fourteenthOptionDown: function() {
				this.bmd.ctx.lineJoin = this.bmd.ctx.lineCap = 'round';
				this.bmd.ctx.strokeStyle = this.getPattern();
			},
			fourteenthOptionMove: function() {

				var tempLineWidth = this.bmd.ctx.lineWidth;
				this.bmd.ctx.lineWidth = this.bmd.ctx.lineWidth * 5;

				this.bmd.ctx.clearRect(0, 0, this.bmd.width, this.bmd.height);
				this.points.push({ x: this.game.input.x, y: this.game.input.y });

				var p1 = this.points[0];
				var p2 = this.points[1];

				this.bmd.ctx.beginPath();
				this.bmd.ctx.moveTo(p1.x, p1.y);

				for (var i = 1, len = this.points.length; i < len; i++) {
					if (!this.points[i].newLine) {
						var midPoint = Phaser.Point.centroid([p1, p2]);
						this.bmd.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
						p1 = this.points[i];
						p2 = this.points[i + 1];
					} else {
						p1 = this.points[i];
						p2 = this.points[i + 1];
						this.bmd.ctx.moveTo(p1.x, p1.y);
					}
				}
				this.bmd.ctx.lineTo(p1.x, p1.y);
				this.bmd.ctx.stroke();

				this.bmd.ctx.lineWidth = tempLineWidth;
			},
			fifteenthOptionMove: function() {

				/*this.layers.forEach(function (bmd) {
				bmd.key.blendDestinationOut();
				bmd.key.circle(this.game.input.x, this.game.input.y, this.bmd.ctx.lineWidth*3, 'rgba(0, 0, 0, 255');
				bmd.key.blendReset();
				bmd.key.dirty = true;
				}, this);*/

				this.bmd.circle(this.game.input.x, this.game.input.y, this.bmd.ctx.lineWidth * 3, 'white');
			},
			drawPixels: function(x, y) {

				var doubleLineWidth = this.bmd.ctx.lineWidth * 2.5;

				for (var i = -doubleLineWidth; i < doubleLineWidth; i += 4) {
					for (var j = -doubleLineWidth; j < doubleLineWidth; j += 4) {
						if (Math.random() > 0.5) {
							this.bmd.ctx.fillStyle = ['red', 'orange', 'yellow', 'green', 'light-blue', 'blue', 'purple'][this.rnd.integerInRange(0, 6)];
							this.bmd.ctx.fillRect(x + i, y + j, 4, 4);
						}
					}
				}
			},
			stroke: function(points) {
				var p1 = points[0];
				var p2 = points[1];

				this.bmd.ctx.beginPath();
				this.bmd.ctx.moveTo(p1.x, p1.y);

				for (var i = 1, len = points.length; i < len; i++) {
					if (!points[i].newLine) {
						var midPoint = Phaser.Point.centroid([p1, p2]);
						this.bmd.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
						p1 = points[i];
						p2 = points[i + 1];
					} else {
						p1 = points[i];
						p2 = points[i + 1];
						this.bmd.ctx.moveTo(p1.x, p1.y);
					}
				}
				this.bmd.ctx.lineTo(p1.x, p1.y);
				this.bmd.ctx.stroke();
			},
			offsetPoints: function(val) {
				var offsetPoints = [];
				for (var i = 0; i < this.points.length; i++) {
					var point = this.points[i];
					offsetPoints.push({
						x: point.x + val,
						y: point.y + val,
						newLine: point.newLine
					});
				}
				return offsetPoints;
			},
			getPattern: function() {
				var dotWidth = 20,
					dotDistance = 5;

				var patternCanvas = this.make.bitmapData(dotWidth + dotDistance, dotWidth + dotDistance);

				patternCanvas.ctx.fillStyle = 'red';
				patternCanvas.ctx.beginPath();
				patternCanvas.ctx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
				patternCanvas.ctx.closePath();
				patternCanvas.ctx.fill();
				return this.bmd.ctx.createPattern(patternCanvas.canvas, 'repeat');
			},
			newLayer: function() {
				var currentLineWidth = this.bmd.ctx.lineWidth;
				this.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
				this.bmd.ctx.lineWidth = currentLineWidth;
				this.layers.add(this.bmd.addToWorld());
				this.points = [];
			},
			render: function() {
				this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
			}
		};

		return state;
	}
})();