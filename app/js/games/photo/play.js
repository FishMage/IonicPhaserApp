(function(Phaser) {
'use strict';

	angular
		.module('App')
		.factory('PhotoPlay', PhotoPlay);

	PhotoPlay.$inject = ['$ionicLoading', '$cordovaSpinnerDialog'];
	function PhotoPlay($ionicLoading, $cordovaSpinnerDialog) {
        
        var $scope = null;

        var getFloat32Array = function (len) {
            var array = [];
            if (typeof Float32Array == 'undefined') {
                if (len.length) {
                    array = len.slice(0);
                } else {
                    array = new Array(len);
                }
            } else {
                array = new Float32Array(len);
            }
            return array;
        };
		
		var state = {
            init: function () {
                this.input.maxPointers = 1;
                this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            },
            preload: function () {
                this.game.load.image('photo', $scope.imageData);
            },
            create: function () {
                this.bmd = this.game.make.bitmapData(this.game.width, this.game.height);
                this.bmd.load('photo');
                
                this.photo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.bmd);
                this.photo.anchor.set(0.5);
                
                this.totalFilters = 9;
            },
            getImage: function(){
                return this.game.canvas.toDataURL();
            },
			resize: function(width, height) {
                
                if(this.photo){
                    this.photo.x = width/2;
                    this.photo.y = height/2;
                    
                    var photoCache = this.game.cache.getFrame('photo');
                    if(photoCache.width > this.photo.width) this.scaleWidth(photoCache.width);
                    if(photoCache.height > this.photo.height) this.scaleHeight(photoCache.height);
                    
                    if(this.photo.width > this.game.width) this.scaleWidth(this.game.width);
                    if(this.photo.height > this.game.height) this.scaleHeight(this.game.height);
                }
			},
            scaleWidth : function (width) {
                var scale = width / this.photo.width;
                this.photo.width = width;
                this.photo.height *= scale;
            },
            scaleHeight: function (height) {
                var scale = height / this.photo.height;
                this.photo.height = height;
                this.photo.width *= scale;
            },
            selectFilter: function (imageData) {
                var self = this;
                var image = new Image();
                image.onload = function() {
                    self.bmd.ctx.drawImage(image, 0, 0);
                };
                image.src = imageData;
            },
            loadPhoto: function (imageData) {
                // var data = new Image();
                // data.src = imageData;
                // this.game.cache.addImage('photo', imageData, data);
                // this.photoLoaded();
                
                //Other example to load base64 string with Phaser
                var loader = new Phaser.Loader(this.game);
                loader.image('photo', imageData);
                loader.onLoadComplete.addOnce(this.photoLoaded, this);
                loader.start();
            },
            photoLoaded: function () {
                var photoCache = this.game.cache.getFrame('photo');
                this.bmd.clear();
                this.bmd.resize(photoCache.width, photoCache.height);
                this.bmd.load('photo');
                
                this.bmdFilter = this.game.make.bitmapData(photoCache.width, photoCache.height);
                
                this.loadFilters();
            },
            loadFilters: function () {
                var options = [];
                
                for (var index = 0; index < this.totalFilters; index++) {
                    this.bmdFilter.clear();
                    this.bmdFilter.ctx.putImageData(this.loadFilter(index), 0, 0);
                    
                    options.push({
                        imageData: this.bmdFilter.canvas.toDataURL('image/png')
                    });
                }
                $scope.photoTool.options = options;
                $scope.$digest();
                
                //Hide loading
                try{
                    $cordovaSpinnerDialog.hide();
                }
                catch(err){
                    $ionicLoading.hide();
                }
            },
            loadFilter: function (position) {
                var output;

                switch (position) {
                    default:
                    case 0:
                        output = this.bmd.imageData;
                        break;
                    case 1:
                        output = this.luminance(this.bmd.imageData);
                        break;
                    case 2:
                        output = this.threshold(this.bmd.imageData, 128);
                        break;
                    case 3:
                        output = this.invert(this.bmd.imageData);
                        break;
                    case 4:
                        output = this.brightnessContrast(this.bmd.imageData, -0.25, 1.5);
                        break;
                    case 5:
                        var lut = {
                            r: this.identityLUT(),
                            g: this.createLUTFromCurve([[0, 0], [10, 0], [128, 58], [200, 222], [225, 255]]),
                            b: this.identityLUT(),
                            a: this.identityLUT()
                        };
                        output = this.applyLUT(this.bmd.imageData, lut);
                        break;
                    case 6:
                        output = this.gaussianBlur(this.bmd.imageData, 8);
                        break;
                    case 7:
                        output = this.grayscale(this.bmd.imageData);
                        break;
                    case 8:
                        output = this.laplace(this.bmd.imageData);
                        break;
                }

                return output;
            },
            luminance: function (pixels) {
                var output = this.bmdFilter.imageData;
                var dst = output.data;
                var d = pixels.data;
                for (var i = 0; i < d.length; i += 4) {
                    var r = d[i];
                    var g = d[i + 1];
                    var b = d[i + 2];
                    // CIE luminance for the RGB
                    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    dst[i] = dst[i + 1] = dst[i + 2] = v;
                    dst[i + 3] = d[i + 3];
                }
                return output;
            },
            threshold: function (pixels, threshold, high, low) {
                var output = this.bmdFilter.imageData;
                if (high == null) high = 255;
                if (low == null) low = 0;
                var d = pixels.data;
                var dst = output.data;
                for (var i = 0; i < d.length; i += 4) {
                    var r = d[i];
                    var g = d[i + 1];
                    var b = d[i + 2];
                    var v = (0.3 * r + 0.59 * g + 0.11 * b >= threshold) ? high : low;
                    dst[i] = dst[i + 1] = dst[i + 2] = v;
                    dst[i + 3] = d[i + 3];
                }
                return output;
            },
            invert: function (pixels) {
                var output = this.bmdFilter.imageData;
                var d = pixels.data;
                var dst = output.data;
                for (var i = 0; i < d.length; i += 4) {
                    dst[i] = 255 - d[i];
                    dst[i + 1] = 255 - d[i + 1];
                    dst[i + 2] = 255 - d[i + 2];
                    dst[i + 3] = d[i + 3];
                }
                return output;
            },
            brightnessContrast: function (pixels, brightness, contrast) {
                var lut = this.brightnessContrastLUT(brightness, contrast);
                return this.applyLUT(pixels, { r: lut, g: lut, b: lut, a: this.identityLUT() });
            },
            identityLUT: function () {
                var lut = this.getUint8Array(256);
                for (var i = 0; i < lut.length; i++) {
                    lut[i] = i;
                }
                return lut;
            },
            applyLUT: function (pixels, lut) {
                var output = this.bmdFilter.imageData;
                var d = pixels.data;
                var dst = output.data;
                var r = lut.r;
                var g = lut.g;
                var b = lut.b;
                var a = lut.a;
                for (var i = 0; i < d.length; i += 4) {
                    dst[i] = r[d[i]];
                    dst[i + 1] = g[d[i + 1]];
                    dst[i + 2] = b[d[i + 2]];
                    dst[i + 3] = a[d[i + 3]];
                }
                return output;
            },
            brightnessContrastLUT: function (brightness, contrast) {
                var lut = this.getUint8Array(256);
                var contrastAdjust = -128 * contrast + 128;
                var brightnessAdjust = 255 * brightness;
                var adjust = contrastAdjust + brightnessAdjust;
                for (var i = 0; i < lut.length; i++) {
                    var c = i * contrast + adjust;
                    lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
                }
                return lut;
            },
            getUint8Array: function (len) {
                var array = [];
                if (typeof Uint8Array == 'undefined') {
                    if (len.length) {
                        array = len.slice(0);
                    } else {
                        array = new Array(len);
                    }
                } else {
                    array = new Uint8Array(len);
                }
                return array;
            },
            createLUTFromCurve: function (points) {
                var lut = this.getUint8Array(256);
                var p = [0, 0];
                for (var i = 0, j = 0; i < lut.length; i++) {
                    while (j < points.length && points[j][0] < i) {
                        p = points[j];
                        j++;
                    }
                    lut[i] = p[1];
                }
                return lut;
            },
            identity: function (pixels) {
                var output = this.bmdFilter.imageData;
                var dst = output.data;
                var d = pixels.data;
                for (var i = 0; i < d.length; i++) {
                    dst[i] = d[i];
                }
                return output;
            },
            verticalConvolveFloat32: function (pixels, weightsVector, opaque) {
                var side = weightsVector.length;
                var halfSide = Math.floor(side / 2);

                var src = pixels.data;
                var sw = pixels.width;
                var sh = pixels.height;

                var w = sw;
                var h = sh;
                var output = this.bmdFilter.imageData;
                var dst = output.data;

                var alphaFac = opaque ? 1 : 0;

                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var sy = y;
                        var sx = x;
                        var dstOff = (y * w + x) * 4;
                        var r = 0, g = 0, b = 0, a = 0;
                        for (var cy = 0; cy < side; cy++) {
                            var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                            var scx = sx;
                            var srcOff = (scy * sw + scx) * 4;
                            var wt = weightsVector[cy];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                        dst[dstOff] = r;
                        dst[dstOff + 1] = g;
                        dst[dstOff + 2] = b;
                        dst[dstOff + 3] = a + alphaFac * (255 - a);
                    }
                }
                return output;
            },
            horizontalConvolve: function (pixels, weightsVector, opaque) {
                var side = weightsVector.length;
                var halfSide = Math.floor(side / 2);

                var src = pixels.data;
                var sw = pixels.width;
                var sh = pixels.height;

                var w = sw;
                var h = sh;
                var output = this.bmdFilter.imageData;
                var dst = output.data;

                var alphaFac = opaque ? 1 : 0;

                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var sy = y;
                        var sx = x;
                        var dstOff = (y * w + x) * 4;
                        var r = 0, g = 0, b = 0, a = 0;
                        for (var cx = 0; cx < side; cx++) {
                            var scy = sy;
                            var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                            var srcOff = (scy * sw + scx) * 4;
                            var wt = weightsVector[cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                        dst[dstOff] = r;
                        dst[dstOff + 1] = g;
                        dst[dstOff + 2] = b;
                        dst[dstOff + 3] = a + alphaFac * (255 - a);
                    }
                }
                return output;
            },
            separableConvolve: function (pixels, horizWeights, vertWeights, opaque) {
                return this.horizontalConvolve(
                    this.verticalConvolveFloat32(pixels, vertWeights, opaque),
                    horizWeights, opaque
                );
            },
            gaussianBlur: function (pixels, diameter) {
                diameter = Math.abs(diameter);
                if (diameter <= 1) return this.identity(pixels);
                var radius = diameter / 2;
                var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2))
                var weights = getFloat32Array(len);
                var rho = (radius + 0.5) / 3;
                var rhoSq = rho * rho;
                var gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
                var rhoFactor = -1 / (2 * rho * rho)
                var wsum = 0;
                var middle = Math.floor(len / 2);
                for (var i = 0; i < len; i++) {
                    var x = i - middle;
                    var gx = gaussianFactor * Math.exp(x * x * rhoFactor);
                    weights[i] = gx;
                    wsum += gx;
                }
                for (var i = 0; i < weights.length; i++) {
                    weights[i] /= wsum;
                }
                var output = this.separableConvolve(pixels, weights, weights, false);
                return output;
            },
            grayscale: function (pixels) {
                var output = this.bmdFilter.imageData;
                var dst = output.data;
                var d = pixels.data;
                for (var i = 0; i < d.length; i += 4) {
                    var r = d[i];
                    var g = d[i + 1];
                    var b = d[i + 2];
                    var v = 0.3 * r + 0.59 * g + 0.11 * b;
                    dst[i] = dst[i + 1] = dst[i + 2] = v;
                    dst[i + 3] = d[i + 3];
                }
                return output;
            },
            laplaceKernel: getFloat32Array([-1, -1, -1, -1, 8, -1, -1, -1, -1]),
            convolve: function (pixels, weights, opaque) {
                var side = Math.round(Math.sqrt(weights.length));
                var halfSide = Math.floor(side / 2);

                var src = pixels.data;
                var sw = pixels.width;
                var sh = pixels.height;

                var w = sw;
                var h = sh;
                var output = this.bmdFilter.imageData;
                var dst = output.data;

                var alphaFac = opaque ? 1 : 0;

                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var sy = y;
                        var sx = x;
                        var dstOff = (y * w + x) * 4;
                        var r = 0, g = 0, b = 0, a = 0;
                        for (var cy = 0; cy < side; cy++) {
                            for (var cx = 0; cx < side; cx++) {
                                var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                                var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                                var srcOff = (scy * sw + scx) * 4;
                                var wt = weights[cy * side + cx];
                                r += src[srcOff] * wt;
                                g += src[srcOff + 1] * wt;
                                b += src[srcOff + 2] * wt;
                                a += src[srcOff + 3] * wt;
                            }
                        }
                        dst[dstOff] = r;
                        dst[dstOff + 1] = g;
                        dst[dstOff + 2] = b;
                        dst[dstOff + 3] = a + alphaFac * (255 - a);
                    }
                }
                return output;
            },
            laplace: function (pixels) {
                return this.convolve(pixels, this.laplaceKernel, true);
            }
        };
		
		return {
            getState: function (scope) {
                $scope = scope;
                return state;
            }
        };
	}
})(Phaser);