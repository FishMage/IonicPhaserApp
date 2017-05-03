// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ngCordova', 'ngAnimate', 'ionic-pullup', 'ion-floating-menu', 'ionic.contrib.ui.tinderCards'])

.run(['$ionicPlatform',
    '$sqliteService',
    function($ionicPlatform, $sqliteService) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        //Load the Pre-populated database, debug = true
        $sqliteService.preloadDataBase(false);
    });
}])
.config(['$stateProvider',
    '$urlRouterProvider',
    '$ionicConfigProvider',
    '$compileProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

        if (window.cordova && !ionic.Platform.isIOS()) {
            //Native Scrolling
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }else{
            $ionicConfigProvider.scrolling.jsScrolling(true);
        }

        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
        $ionicConfigProvider.views.swipeBackEnabled(false);

        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "templates/home.html",
                controller: 'HomeController'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'MenuController'
            })
            .state('app.gallery', {
                url: "/gallery",
                views: {
                    viewContent: {
                        templateUrl: "templates/gallery.html",
                        controller: 'GalleryController'
                    }
                }
            })
            .state('app.dragon', {
                url: "/dragon",
                views: {
                    viewContent: {
                        templateUrl: "templates/board.html",
                        controller: 'DragonController'
                    }
                }
            })
            .state('app.signature', {
                url: "/signature",
                views: {
                    viewContent: {
                        templateUrl: "templates/game_3.html",
                        controller: 'SignatureController'
                    }
                }
            })

			.state('app.starwars', {
                url: "/starwars",
                views: {
                    viewContent: {
                        templateUrl: "templates/starwars.html",
                        controller: 'StarWarsController'
                    }
                }
            })
            .state('app.photo', {
                url: "/photo",
                views: {
                    viewContent: {
                        templateUrl: "templates/photo.html",
                        controller: 'PhotoController'
                    }
                }
            })
            .state('app.tinder', {
                url: "/tinder",
                views: {
                    viewContent: {
                        templateUrl: "templates/tinder.html",
                        controller: 'TinderController'
                    }
                }
            })
            .state('app.flappybird', {
                url: "/flappybird",
                views: {
                    viewContent: {
                        templateUrl: "templates/flappybird.html",
                        controller: 'FlappyBirdController'
                    }
                }
            });

        $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("home");
        });
}]);

/* global ionic */
(function (angular, ionic) {
	"use strict";

	ionic.Platform.isIE = function () {
		return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
	}

	if (ionic.Platform.isIE()) {
		angular.module('ionic')
			.factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
				return function (scope, element, clickExpr) {
					var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

					element.on('click', function (event) {
						scope.$apply(function () {
							if (scope.clicktimer) return; // Second call
							clickHandler(scope, { $event: (event) });
							scope.clicktimer = $timeout(function () { delete scope.clicktimer; }, 1, false);
						});
					});

					// Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
					// something else nearby.
					element.onclick = function (event) { };
				};
			}]);
	}

	function SelectDirective() {
		'use strict';

		return {
			restrict: 'E',
			replace: false,
			link: function (scope, element) {
				if (ionic.Platform && (ionic.Platform.isWindowsPhone() || ionic.Platform.isIE() || ionic.Platform.platform() === "edge")) {
					element.attr('data-tap-disabled', 'true');
				}
			}
		};
	}

	angular.module('ionic')
    .directive('select', SelectDirective);

	/*angular.module('ionic-datepicker')
	.directive('select', SelectDirective);*/

})(angular, ionic);
window.queries = [

];
(function(Phaser) {
	'use strict';

	angular
		.module('App')
		.controller('DragonController', DragonController);

	DragonController.$inject = ['$scope', 'DragonGame', '$ionicSideMenuDelegate'];
	function DragonController($scope, DragonGame, $ionicSideMenuDelegate) {
       $scope.board = [
            [ { value: '-' }, { value: '-' }, { value: '-' } ],
            [ { value: '-' }, { value: '-' }, { value: '-' } ],
            [ { value: '-' }, { value: '-' }, { value: '-' } ]
        ];

        $scope.reset = function() {
            // TODO: set each cell.value = '-'
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 3; j++){
                    $scope.board[i][j].value = '-';
                }
            }
            $scope.currentPlayer = 'X';
            $scope.winner = false;
            $scope.cat = false;
        };

        $scope.reset();

        $scope.isTaken = function(cell) {
            return cell.value !== '-';
        };

        var checkForMatch = function(cell1, cell2, cell3) {
            return cell1.value === cell2.value &&
                cell1.value === cell3.value &&
                cell1.value !== '-';
        };

        var checkForEndOfGame = function() {
            // TODO: check for a rowMatch, columnMatch, or diagonalMatch
            for(var i = 0; i < 3; i++) {
                if (checkForMatch($scope.board[i][0],$scope.board[i][1],$scope.board[i][2]) === true) {
                    $scope.winner = true;
                }
            }
            for(var j = 0; j < 3; j++){
                if(checkForMatch($scope.board[0][j],$scope.board[1][j],$scope.board[2][j]) === true) {
                    $scope.winner = true;
                }
            }
            if(checkForMatch($scope.board[0][0],$scope.board[1][1],$scope.board[2][2]) === true){
                $scope.winner = true;
            }

            else if(checkForMatch($scope.board[0][2],$scope.board[1][1],$scope.board[2][0]) === true){
                $scope.winner = true;
            }

            // $scope.winner = rowMatch || columnMatch || diagonalMatch;

            // TODO: if we don't have a winner, check for cat
            var cat = true;
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 3; j++){
                    if($scope.board[i][j].value == '-'){
                        cat = false;
                    }

                }
            }
            $scope.cat = cat;
            return $scope.winner || $scope.cat;
        };

        $scope.move = function(cell) {
            cell.value = $scope.currentPlayer;
            if (checkForEndOfGame() === false) {
                $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
            }
        };
	}
})(Phaser);
(function() {
'use strict';

    angular
        .module('App')
        .controller('FlappyBirdController', FlappyBirdController);

    FlappyBirdController.$inject = ['$scope', 'FlappyBirdPlay'];
    function FlappyBirdController($scope, FlappyBirdPlay) {

        $scope.isDebugging = false;

        $scope.flappybird = {
            width: "100%",
			height: "100%",
			renderer: Phaser.AUTO,
            state: FlappyBirdPlay.getState($scope),
			loadPath: "res/flappybird/"
        };

        $scope.toggleDebug = function(){
            $scope.isDebugging = !$scope.isDebugging;
            $scope.flappybird.instance.state.getCurrentState().toggleDebug($scope.isDebugging);
        };
    }
})();
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
				"img": "img/dragon.jpg",
				"state": "app.dragon"
			},
			{
				"title": "Signature",
				"img": "img/signature.png",
				"state": "app.signature"
			},
            {
                "title": "Tinder",
                "img": "img/tinder.jpg",
                "state": "app.tinder"
            },
            {
                "title": "Flappy Bird",
                "img": "img/flappybird.jpg",
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
(function () {
	'use strict';

	angular
		.module('App')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$timeout'];
	function HomeController($scope, $timeout) {

		$scope.animateLogo = function ($event) {
            var $logo = angular.element($event.target);
            //Remove the animation and delay
            $logo.removeClass("tada").removeClass("animatedDelay");

            $timeout(function () {
                //Animate again
                $logo.addClass("tada");
            }, 100);
        };
	}
})();
(function() {
'use strict';

    angular
        .module('App')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope'];
    function MenuController($scope) {

        $scope.exitApp = function(){
            ionic.Platform.exitApp();
        };
    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('PhotoController', PhotoController);

    PhotoController.$inject = ['$scope', 'PhotoPlay', '$cordovaCamera', 'Modals', '$ionicLoading', '$timeout', '$cordovaSpinnerDialog'];
    function PhotoController($scope, PhotoPlay, $cordovaCamera, Modals, $ionicLoading, $timeout, $cordovaSpinnerDialog) {

        $scope.imageData = "img/camera.png";

        $scope.photo = {
            width: "100%",
            height: "100%",
            transparent: true,
            state: angular.copy(PhotoPlay.getState($scope))
        };

        $scope.photoTool = {
            options: []
        };

        $scope.takePhoto = function() {

            var options = {
                quality: 50,
                allowEdit: true,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            if (Camera) {
                options.destinationType = Camera.DestinationType.DATA_URL;
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.encodingType = Camera.EncodingType.JPEG;
            } else {
                $ionicLoading.hide();
                alert("You need test the camera in the device or emulator :)");
            }

            $cordovaCamera.getPicture(options).then(function(imageData) {
                try{
                    $cordovaSpinnerDialog.show(null, null, true);
                }
                catch(err){
                    $ionicLoading.show({
                        template: '<ion-spinner class="spinner-calm bigSpinner" icon="ripple"></ion-spinner>',
                        hideOnStateChange: true
                    });
                }
                //Fix to show the loading before to take the photo
                $timeout(function () {
                    getPhoto(imageData);
                }, 200);

                }, function(err) {
                // error
                //alert("Error with cordova camera, maybe you need install this plugin using the CLI :(");
            });
        };

        function getPhoto(imageData) {
            var newImg = document.getElementById("newImg");

            var img = new Image();
            img.src = "data:image/jpeg;base64," + imageData;
            img.onload = function() {

                var currentDimensions = {
                    width: img.width,
                    height: img.height
                }
                //Resize the big image using a canvas element! :)
                resizeImage(currentDimensions, 500, 500);
                newImg.width = currentDimensions.width;
                newImg.height = currentDimensions.height;
                var ctx = newImg.getContext("2d");
                ctx.drawImage(img, 0, 0, currentDimensions.width, currentDimensions.height);

                //Load the image
                $scope.photo.instance.state.getCurrentState().loadPhoto(newImg.toDataURL('image/png'));
            };
        }

        $scope.selectFilter = function(option) {
            $scope.photoTool.options.map(function(option) { option.selected = false; });
            option.selected = true;

            $scope.photo.instance.state.getCurrentState().selectFilter(option.imageData);
        };

        $scope.previewPhoto = function() {

            $scope.previewImage = $scope.photo.instance.state.getCurrentState().getImage();
            Modals.openModal($scope, 'templates/modals/previewImage.html', 'bounceInRight animated');
        };

        $scope.closeModal = function() {
            Modals.closeModal();
        };

        //Resize image with maxHeight or maxHeight
        function resizeImage(img, maxHeight, maxWidth) {
            var ratio = maxHeight / maxWidth;
            if (img.height / img.width > ratio) {
                // height is the problem
                if (img.height > maxHeight) {
                    img.width = Math.round(img.width * (maxHeight / img.height));
                    img.height = maxHeight;
                }
            } else {
                // width is the problem
                if (img.width > maxHeight) {
                    img.height = Math.round(img.height * (maxWidth / img.width));
                    img.width = maxWidth;
                }
            }
        }
    }
})();
(function() {
	'use strict';

	angular
		.module('App')
		.controller('SignatureController', function($scope, $state,$stateParams,$timeout) {
      $scope.playerScores = [0, 0];

      $scope.startHome = function(){
        $state.go("home", {

        })
      }
      $scope.countController = function(){
          var timerCount = 15;
          var countDown = function () {
              if (timerCount < 0) {
                  //Any desired function upon countdown end.
                  // $window.close()
                  // alert("Player " + ($scope.playerScores[0] > $scope.playerScores[1] ? "One " : "Two ") + "Win !");
                  resetScore();
              } else {
                  $scope.countDownLeft = timerCount;
                  timerCount--;
                  $timeout(countDown, 1000);
              }
          };
          $scope.countDownLeft = timerCount;
          countDown();
      }
      function getRandomOperator() {
        // alert("getRandomOperator");
        var operators = ["+", "-", "*", "/"];
        return operators[getRandomInt(0, 3)];
      }

      function getRandomInt(min, max) {
        // alert("getRandomInt");
        min = Math.ceil(min);
        max = Math.floor(max);
        // alert(min,max);
        return Math.floor(Math.random() * (max - min)) + min;
      }

      function getRandomAnswer(previousRandomAnswers) {
        var minCoefficient = 0.5;
        var maxCoefficient = 2;
        var constant = getRandomInt(1, 9);
        constant *= ((getRandomInt(0, 1) == 0) ? -1 : 1);
        var randomAnswer = getRandomInt(minCoefficient * previousRandomAnswers[0] + constant, maxCoefficient * previousRandomAnswers[0] + constant);
        for (var i = 0; i < previousRandomAnswers.length; i++) {
          if (previousRandomAnswers[i] == randomAnswer) {
            return getRandomAnswer(previousRandomAnswers);
          }
        }
        return randomAnswer;
      }

      function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
        }
      }

      // +, - only for simplicity
      $scope.getRandomQuestion = function() {
        // alert("Reach randomQuestion!");
        var numberOfAnswers = 4;
        var valueNum = getRandomInt(2, 4);
        var question = {
          "question" : "",
          "answers": [],
          "result": "",
        };
        // alert("1question: ", question.question);
        for (var i = 0; i < valueNum; i++) {
          var num = getRandomInt(1, 9);
          question.question += num + " ";
          if (i != valueNum - 1) {
            question.question += getRandomOperator() + " ";
          }
        }
        // alert("before: question:***"+ question.question+"***");
        question.question = question.question.substring(0, question.question.length - 1);
        question.result = eval(question.question);
        // question.result = 3;

        // alert("after: question:***"+ question.question+"***");
        for (var i = 0; i < numberOfAnswers; i++) {
          if (i == 0) question.answers.push(question.result);
          else {
            question.answers.push(getRandomAnswer(question.answers));
          }
        }
        // alert("answers: "+ question.answers);
        $scope.question = question;
        // $scope.countDownLeft = 5;
        // $scope.countController();
      }

      function resetScore() {
        $scope.playerScores = [0 , 0];
      }

      $scope.checkResult = function(user, response) {
        if (response.toFixed(0) == $scope.question.result.toFixed(0)) {
          $scope.playerScores[user]++;
          // alert("Correct!");
        }
        else {
          $scope.playerScores[Math.abs(user-1)]++;
        }
        // Check win
        if ($scope.playerScores[0] == 4 || $scope.playerScores[1] == 4) {
          // DONT DO IT!
          alert("Player " + ($scope.playerScores[0] == 4 ? "One " : "Two ") + "Win !");
          resetScore();
          state.go("home", {});
        }
        else {
          $scope.getRandomQuestion();
        }
      }
    })
})();
(function() {
'use strict';

	angular
		.module('App')
		.controller('StarWarsController', StarWarsController);

	StarWarsController.$inject = ['$scope', 'StarWarsPlay'];
	function StarWarsController($scope, StarWarsPlay) {

		$scope.starwars = {
			width: "100%",
			height: "100%",
			renderer: Phaser.AUTO,
			state: angular.copy(StarWarsPlay),
			transparent: true,
			initialize: false,
            loadPath: "res/starwars/"
		};

        $scope.$on('$ionicView.afterEnter', function () {
			$scope.starwars.height = document.getElementById("starwars").clientHeight;
			$scope.starwars.width = document.getElementById("starwars").clientWidth;
			$scope.starwars.initialize = true;
		});

        $scope.$on('$ionicView.afterLeave', function(){
            angular.element(document.getElementsByClassName("starwars3D")).removeClass("starwars3D");
        });
	}
})();
(function() {
'use strict';

    angular
        .module('App')
        .controller('TinderController', TinderController);

    TinderController.$inject = ['$scope', 'TinderPlay'];
    function TinderController($scope, TinderPlay) {

        $scope.tinder = {
            width: "100%",
			height: "100%",
			renderer: Phaser.AUTO,
            transparent: true,
            state: TinderPlay,
			loadPath: "res/tinder/"
        };

        var cardsCopy = [
            { image: 'img/ironman.jpg' },
            { image: 'img/pikachu.png' },
            { image: 'img/steveJobs.jpg' },
            { image: 'img/trump.jpg' },
            { image: 'img/minion.jpg' },
            { image: 'img/kim.jpg' },
            { image: 'img/jb.jpg' },
        ];

        $scope.fillCards = function(){
            setTimeout(function(){
                $scope.cards = Array.prototype.slice.call(cardsCopy, 0);
                $scope.$apply();

                $scope.tinder.instance.state.getCurrentState().stop();
            }, 4000);
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);

            if(!$scope.cards.length){
                $scope.tinder.instance.state.getCurrentState().play();
                $scope.fillCards();
            }
        };

        $scope.cardSwipedLeft = function(index) {
            var card = $scope.cards[index];
            $scope.tinder.instance.state.getCurrentState().dislike();
        };
        $scope.cardSwipedRight = function(index) {
            var card = $scope.cards[index];
            $scope.tinder.instance.state.getCurrentState().like();
        };

        $scope.$on('$ionicView.enter', function () {
			$scope.cards = [];
            $scope.fillCards();
		});
    }
})();
(function() {
	'use strict';

	angular
		.module('App')
		.directive('disableSideMenu', disableSideMenu);

	disableSideMenu.$inject = ['$ionicGesture', '$ionicSideMenuDelegate'];
	function disableSideMenu($ionicGesture, $ionicSideMenuDelegate) {

		return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $ionicGesture.on('touch', function (e) {
                $ionicSideMenuDelegate.canDragContent(false);
            }, element);

            $ionicGesture.on('release', function (e) {
                $ionicSideMenuDelegate.canDragContent(true);
            }, element);
        }
    };
	}
})();
(function() {
    'use strict';

    angular
        .module('App')
        .directive('disableTouchMove', disableTouchMove);

    function disableTouchMove() {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $element.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('holdList', holdList);

	holdList.$inject = ['$ionicGesture'];
	function holdList($ionicGesture) {

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				$ionicGesture.on('hold', function (e) {

					var content = element[0].querySelector('.item-content');

					var buttons = element[0].querySelector('.item-options');
					var buttonsWidth = buttons.offsetWidth;

					ionic.requestAnimationFrame(function () {
						content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

						if (!buttons.classList.contains('invisible')) {
							content.style[ionic.CSS.TRANSFORM] = '';
							setTimeout(function () {
								buttons.classList.add('invisible');
							}, 250);
						} else {
							buttons.classList.remove('invisible');
							content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
						}
					});


				}, element);
			}
		};
	}
})();
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
(function () {
	'use strict';

	angular
		.module('App')
		.directive('ionMultipleSelect', ionMultipleSelect);

	ionMultipleSelect.$inject = ['$ionicModal', '$ionicGesture'];
	function ionMultipleSelect($ionicModal, $ionicGesture) {

		return {
			restrict: 'E',
			scope: {
				options: "="
			},
			controller: function ($scope, $element, $attrs) {
				$scope.multipleSelect = {
					title: $attrs.title || "Select Options",
					tempOptions: [],
					keyProperty: $attrs.keyProperty || "id",
					valueProperty: $attrs.valueProperty || "value",
					selectedProperty: $attrs.selectedProperty || "selected",
					templateUrl: $attrs.templateUrl || 'templates/multipleSelect.html',
					renderCheckbox: $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
					animation: $attrs.animation || 'slide-in-up'
				};

				$scope.OpenModalFromTemplate = function (templateUrl) {
					$ionicModal.fromTemplateUrl(templateUrl, {
						scope: $scope,
						animation: $scope.multipleSelect.animation
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
					});
				};

				$ionicGesture.on('tap', function (e) {
					$scope.multipleSelect.tempOptions = $scope.options.map(function (option) {
						var tempOption = {};
						tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
						tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
						tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];

						return tempOption;
					});
					$scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
				}, $element);

				$scope.saveOptions = function () {
					for (var i = 0; i < $scope.multipleSelect.tempOptions.length; i++) {
						var tempOption = $scope.multipleSelect.tempOptions[i];
						for (var j = 0; j < $scope.options.length; j++) {
							var option = $scope.options[j];
							if (tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]) {
								option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
								break;
							}
						}
					}
					$scope.closeModal();
				};

				$scope.closeModal = function () {
					$scope.modal.remove();
				};
				$scope.$on('$destroy', function () {
					if ($scope.modal) {
						$scope.modal.remove();
					}
				});
			}
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('ionSearchSelect', ionSearchSelect);

	ionSearchSelect.$inject = ['$ionicModal', '$ionicGesture'];
	function ionSearchSelect($ionicModal, $ionicGesture) {

		return {
			restrict: 'E',
			scope: {
				options: "=",
				optionSelected: "="
			},
			controller: function ($scope, $element, $attrs) {
				$scope.searchSelect = {
					title: $attrs.title || "Search",
					keyProperty: $attrs.keyProperty,
					valueProperty: $attrs.valueProperty,
					templateUrl: $attrs.templateUrl || 'templates/searchSelect.html',
					animation: $attrs.animation || 'slide-in-up',
					option: null,
					searchvalue: "",
					enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
				};

				$ionicGesture.on('tap', function (e) {

					if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
						if ($scope.optionSelected) {
							$scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
						}
					}
					else {
						$scope.searchSelect.option = $scope.optionSelected;
					}
					$scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
				}, $element);

				$scope.saveOption = function () {
					if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
						for (var i = 0; i < $scope.options.length; i++) {
							var currentOption = $scope.options[i];
							if (currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option) {
								$scope.optionSelected = currentOption;
								break;
							}
						}
					}
					else {
						$scope.optionSelected = $scope.searchSelect.option;
					}
					$scope.searchSelect.searchvalue = "";
					$scope.modal.remove();
				};

				$scope.clearSearch = function () {
					$scope.searchSelect.searchvalue = "";
				};

				$scope.closeModal = function () {
					$scope.modal.remove();
				};
				$scope.$on('$destroy', function () {
					if ($scope.modal) {
						$scope.modal.remove();
					}
				});

				$scope.OpenModalFromTemplate = function (templateUrl) {
					$ionicModal.fromTemplateUrl(templateUrl, {
						scope: $scope,
						animation: $scope.searchSelect.animation
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
					});
				};
			}
		};
	}
})();
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
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Modals', Modals);

	Modals.$inject = ['$ionicModal'];
	function Modals($ionicModal) {

		var modals = [];

		var _openModal = function ($scope, templateUrl, animation) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: animation || 'slide-in-up',
				backdropClickToClose: false
			}).then(function (modal) {
				modals.push(modal);
				modal.show();
			});
		};

		var _closeModal = function () {
			var currentModal = modals.splice(-1, 1)[0];
			currentModal.remove();
		};

		var _closeAllModals = function () {
			modals.map(function (modal) {
				modal.remove();
			});
			modals = [];
		};

		return {
			openModal: _openModal,
			closeModal: _closeModal,
			closeAllModals: _closeAllModals
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Model', Model);

	Model.$inject = ['Users'];
	function Model(Users) {

		return {
			Users: Users
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.service('$sqliteService', $sqliteService);

	$sqliteService.$inject = ['$q', '$cordovaSQLite'];
	function $sqliteService($q, $cordovaSQLite) {

		var self = this;
		var _db;

		self.db = function () {
			if (!_db) {
				if (window.sqlitePlugin !== undefined) {
					_db = window.sqlitePlugin.openDatabase({ name: "pre.db", location: 2, createFromLocation: 1 });
				} else {
					// For debugging in the browser
					_db = window.openDatabase("pre.db", "1.0", "Database", 200000);
				}
			}
			return _db;
		};

		self.getFirstItem = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {

				if (res.rows.length > 0)
					return deferred.resolve(res.rows.item(0));
				else
					return deferred.reject("There aren't items matching");
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.getFirstOrDefaultItem = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {

				if (res.rows.length > 0)
					return deferred.resolve(res.rows.item(0));
				else
					return deferred.resolve(null);
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.getItems = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {
				var items = [];
				for (var i = 0; i < res.rows.length; i++) {
					items.push(res.rows.item(i));
				}
				return deferred.resolve(items);
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.preloadDataBase = function (enableLog) {
			var deferred = $q.defer();

			//window.open("data:text/plain;charset=utf-8," + JSON.stringify({ data: window.queries.join('').replace(/\\n/g, '\n') }));
			if (window.sqlitePlugin === undefined) {
				enableLog && console.log('%c ***************** Starting the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
				self.db().transaction(function (tx) {
					for (var i = 0; i < window.queries.length; i++) {
						var query = window.queries[i].replace(/\\n/g, '\n');

						enableLog && console.log(window.queries[i]);
						tx.executeSql(query);
					}
				}, function (error) {
					deferred.reject(error);
				}, function () {
					enableLog && console.log('%c ***************** Completing the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
					deferred.resolve("OK");
				});
			}
			else {
				deferred.resolve("OK");
			}

			return deferred.promise;
		};

		self.executeSql = function (query, parameters) {
			return $cordovaSQLite.execute(self.db(), query, parameters);
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Users', Users);

	Users.$inject = ['$q', '$sqliteService'];
	function Users($q, $sqliteService) {

		return {
			getAll: function () {
				var query = "Select * FROM Users";
				return $q.when($sqliteService.getItems(query));
			},
			add: function (user) {
				var query = "INSERT INTO Users (Name) VALUES (?)";
				return $q.when($sqliteService.executeSql(query, [user.Name]));
			}
		};
	}
})();
(function() {
'use strict';

	angular
		.module('App')
		.factory('DragonGame', DragonGame);

	DragonGame.$inject = ['DefaultBoot', 'DragonLoad', 'DragonPlay'];
	function DragonGame(DefaultBoot, DragonLoad, DragonPlay) {

		return {
			Boot: DefaultBoot,
			Load: DragonLoad,
			Play: DragonPlay
		};
	}
})();
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
(function(Phaser) {
'use strict';

    angular
        .module('App')
        .factory('FlappyBirdPlay', FlappyBirdPlay);

    FlappyBirdPlay.$inject = ['$cordovaVibration', '$timeout'];
    function FlappyBirdPlay($cordovaVibration, $timeout) {
      var randomNum = Math.floor(Math.random() * 3) + 1;
        var $scope = null;

        var state = {
            init: function() {
				if(randomNum == 1){
				this.stage.backgroundColor = "#8585ad";
				}
				else if(randomNum == 2){
				this.stage.backgroundColor = "#99ffdd";
				}
				else {
                this.stage.backgroundColor = "#cce6ff";
				}

				this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.updateLayout();

                //Pixel Art
		        this.game.renderer.renderSession.roundPixels = true;
                this.game.time.desiredFps = 60;
			},
            preload: function(){
                //var randomNum = Math.floor(Math.random() * 2) + 1

                if (randomNum == 1){
                    this.game.load.image('tube', 'assets/firepillar.png');
                    this.game.load.image('ground', 'assets/lava.png');
                    this.game.load.spritesheet('bird', 'assets/doraemon.png', 100, 100);
                }
                else if(randomNum == 2){
                    this.game.load.image('tube', 'assets/tree.png');
                      this.game.load.image('ground', 'assets/wave.png');
                     this.game.load.spritesheet('bird', 'assets/chopper.png', 100, 100);
                }
                else {
                    this.game.load.image('tube', 'assets/building.png');
                    this.game.load.image('ground', 'assets/ground.png');
                    this.game.load.spritesheet('bird', 'assets/superman.png', 100, 100);
                }




                this.game.load.audio('hit', ['audio/hit.ogg']);
                this.game.load.audio('die', ['audio/die.ogg']);
                this.game.load.audio('point', ['audio/point.ogg']);
                this.game.load.audio('wing', ['audio/wing.ogg', 'audio/wing.mp3']);
            },
            create: function(){
                this.isDebugging = $scope.isDebugging;
                this.totalScore = 0;
                this.started = false;
                this.dead = false;
                this.canJump = true;
                this.canRestart = false;

                this.game.world.setBounds(-10, 0, this.game.width + 10, this.game.height);
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.game.physics.arcade.checkCollision.up = false;

                this.tubes = this.game.add.group();
                this.tubes.enableBody = true;
                this.tubes.createMultiple(12, 'tube');
                this.newtubes = this.game.time.events.loop(1500, this.newTube, this);
                this.newtubes.timer.stop(false);

                this.sensors = this.game.add.group();
                this.sensors.enableBody = true;

                var groundCache = this.game.cache.getFrame('ground');
                this.ground = this.game.add.tileSprite(-10, this.game.height, this.game.width + 20, groundCache.height, 'ground');
                this.ground.anchor.y = 1;
                this.game.physics.arcade.enable(this.ground);
                this.ground.body.immovable = true;
                this.ground.body.moves = false;
                this.ground.autoScroll(-50, 0);

                this.bird = this.game.add.sprite(this.game.world.centerX/2, this.game.world.centerY, 'bird');
                this.bird.anchor.set(0.5);
                this.bird.scale.set(0.8);
                this.bird.animations.add('fly', null, 15, true);
                this.bird.animations.play('fly');
                this.tweenFly = this.game.add.tween(this.bird);
                this.tweenFly.to({ y: this.bird.y + 20}, 400, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

                this.bird.checkWorldBounds = true;
                this.bird.pivot.x = -this.bird.width/2;
                this.bird.events.onOutOfBounds.add(function(){
                    this.canJump = false;
                }, this);
                this.bird.events.onEnterBounds.add(function(){
                    this.canJump = true;
                }, this);

                this.game.input.onDown.add(this.jump, this);
                this.scoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY/3, "0", { font: "60px Arial", fill: "#ffffff" });
                this.scoreText.anchor.set(0.5);

                this.hitAudio = this.add.audio('hit');
                this.dieAudio = this.add.audio('die');
                this.pointAudio = this.add.audio('point');
                this.wingAudio = this.add.audio('wing');
            },
            start: function(){
                this.ground.autoScroll(0, 0);
                this.tweenFly.stop();
                this.game.physics.arcade.enable(this.bird);
                this.bird.body.setSize(this.bird.width - 10, this.bird.height - 10, 0, 0);
                this.bird.body.gravity.y = 2000;
                this.bird.body.collideWorldBounds = true;

                this.newtubes.timer.start();

                this.started = true;
            },
            gameOver: function(){
                var self = this;
                this.newtubes.timer.stop(false);

                this.game.add.tween(this.game.camera).to({ x: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);
                this.bird.animations.stop();

                this.flash = this.game.add.graphics(-10, 0);
				this.flash.beginFill(0xffffff, 1);
				this.flash.drawRect(0, 0, this.game.width + 20, this.game.height);
				this.flash.endFill();
                this.flash.alpha = 0.5;
                this.game.add.tween(this.flash).to({ alpha: 0 }, 50, Phaser.Easing.Cubic.In, true);

                this.dead = true;

                var self = this;
                setTimeout(function(){
                    self.canRestart = true;
                }, Phaser.Timer.SECOND * 0.5);

                this.tubes.forEachAlive(function(tube){
                    tube.body.velocity.x = 0;
                }, this);
                this.sensors.forEachAlive(function(sensor){
                    sensor.body.velocity.x = 0;
                }, this);

                try {
                    $cordovaVibration.vibrate(300);
                } catch (error) {
                    console.log(error);
                }

                this.hitAudio.play();
                $timeout(function () {
                    self.dieAudio.play();
                }, 300);
            },
            jump: function(){
                if(!this.dead) {
                    this.start();
                }

                if(!this.dead && this.canJump) {

                    var tempV = Math.floor(Math.random() * 300) + 1
                    var realV = 400+tempV
                    this.bird.animations.play('fly');
                    this.birdInJump = true;
                    this.bird.body.velocity.y = -realV;
                    this.wingAudio.play();
                }

                if(this.dead && this.canRestart) {
                    this.game.state.start(this.game.state.current);
                }
            },
            update: function(){
                this.game.physics.arcade.collide(this.bird, this.ground);

                if(!this.started) return;

                this.updateAngle();

                if(this.dead) return;

                this.game.physics.arcade.overlap(this.bird, this.tubes, this.gameOver, null, this);
                this.game.physics.arcade.overlap(this.bird, this.sensors, this.incrementScore, null, this);
                this.ground.tilePosition.x -= 2;

                if(this.bird.body.touching.down){
                    this.gameOver();
                }
            },
            updateAngle: function(){

                if(this.bird.body.touching.down) return;

                if(this.birdInJump){
                    if(this.bird.angle > -30){
                        this.bird.angle -= 5;
                    }else{
                        this.birdInJump = false;
                    }
                }else if(this.bird.angle < 0){
                    this.bird.angle += 1;
                }else if(this.bird.angle < 45){
                    this.bird.animations.stop();
                    this.bird.angle += 2;
                }else if(this.bird.angle < 90){
                    this.bird.angle += 4;
                }
            },
            resize: function(){

                if(this.bird){
                    this.bird.x = this.game.world.centerX/2;
                }
                if(this.scoreText){
                    this.scoreText.y = this.game.world.centerY/3;
                    this.scoreText.x = this.game.world.centerX;
                }
                if (this.ground) {
                    this.ground.width = this.game.width + 20;
                }
            },
            render: function(){
                if(!this.isDebugging) return;

                this.game.debug.text('Debugging', 10, 30, 'white', '20px "Sigmar One"');
                this.game.debug.body(this.bird);
                this.game.debug.body(this.ground, 'rgba(255, 255, 0, 0.5)');
                this.game.debug.geom(new Phaser.Point(this.bird.x, this.bird.y), '#FFFF00');
                this.tubes && this.tubes.forEachAlive(function(tube){
                    this.game.debug.body(tube, 'rgba(0, 0, 255, 0.5)');
                }, this);
                this.sensors && this.sensors.forEachAlive(function(sensor){
                    this.game.debug.body(sensor, 'rgba(0, 255, 0, 0.5)');
                }, this);
            },
            newTube: function(){
                var randomPosition = this.game.rnd.integerInRange(120, this.game.height - this.ground.height - 100);

                var tube = this.game.cache.getFrame('tube');

                var tube1 = this.tubes.getFirstDead();
                tube1.reset(this.game.width + tube.width/2, randomPosition - 180);
                tube1.anchor.setTo(0.5, 1);
                tube1.scale.set(1.4);
                tube1.body.velocity.x = -180;
                tube1.body.immovable = true;
                tube1.checkWorldBounds = true;
                tube1.outOfBoundsKill = true;

                var tube2 = this.tubes.getFirstDead();
                tube2.reset(this.game.width + tube.width/2, randomPosition + 150 + tube.height/2);
                tube2.anchor.setTo(0.5, 0.5);
                tube2.scale.setTo(-1.4, -1.4);
                tube2.body.velocity.x = -180;
                tube2.body.immovable = true;
                tube2.checkWorldBounds = true;
                tube2.outOfBoundsKill = true;

                var sensor = this.sensors.create(this.game.width + tube.width, 0);
                sensor.body.setSize(40, this.game.height);
                sensor.body.velocity.x = -180;
                sensor.body.immovable = true;
                sensor.alpha = 0;
            },
            incrementScore: function(bird, sensor){
                sensor.kill();
                this.totalScore++;
                this.scoreText.setText(this.totalScore);
                this.pointAudio.play();
            },
            toggleDebug: function (isDebugging) {
                this.game.debug.reset();
                this.isDebugging = isDebugging;
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
(function(Phaser) {
'use strict';

    angular
        .module('App')
        .factory('TinderPlay', TinderPlay);

    //TinderPlay.$inject = [];
    function TinderPlay() {

        var state = {
            init: function() {
				// this.stage.backgroundColor = 0x111111;
				this.input.maxPointers = 1;
				this.stage.disableVisibilityChange = true;
				this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
				this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.scale.updateLayout();
			},
            preload: function () {
                this.load.image('ionphaser', 'assets/logo.png');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsInF1ZXJpZXMuanMiLCJjb250cm9sbGVycy9kcmFnb24uanMiLCJjb250cm9sbGVycy9mbGFwcHliaXJkLmpzIiwiY29udHJvbGxlcnMvZ2FsbGVyeS5qcyIsImNvbnRyb2xsZXJzL2hvbWUuanMiLCJjb250cm9sbGVycy9tZW51LmpzIiwiY29udHJvbGxlcnMvcGhvdG8uanMiLCJjb250cm9sbGVycy9zaWduYXR1cmUuanMiLCJjb250cm9sbGVycy9zdGFyd2Fycy5qcyIsImNvbnRyb2xsZXJzL3RpbmRlci5qcyIsImRpcmVjdGl2ZXMvZGlzYWJsZVNpZGVNZW51LmpzIiwiZGlyZWN0aXZlcy9kaXNhYmxlVG91Y2hNb3ZlLmpzIiwiZGlyZWN0aXZlcy9ob2xkTGlzdC5qcyIsImRpcmVjdGl2ZXMvaW9uUGhhc2VyLmpzIiwiZGlyZWN0aXZlcy9tdWx0aXBsZVNlbGVjdC5qcyIsImRpcmVjdGl2ZXMvc2VhcmNoU2VsZWN0LmpzIiwiZ2FtZXMvYm9vdC5qcyIsInNlcnZpY2VzL21vZGFscy5qcyIsInNlcnZpY2VzL21vZGVsLmpzIiwic2VydmljZXMvc3FsaXRlLmpzIiwic2VydmljZXMvdXNlcnMuanMiLCJnYW1lcy9kcmFnb24vZ2FtZS5qcyIsImdhbWVzL2RyYWdvbi9sb2FkLmpzIiwiZ2FtZXMvZHJhZ29uL3BsYXkuanMiLCJnYW1lcy9mbGFwcHliaXJkL3BsYXkuanMiLCJnYW1lcy9waG90by9wbGF5LmpzIiwiZ2FtZXMvc2lnbmF0dXJlL3BsYXkuanMiLCJnYW1lcy9zdGFyd2Fycy9wbGF5LmpzIiwiZ2FtZXMvdGluZGVyL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdGZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnQXBwJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuYW5ndWxhci5tb2R1bGUoJ0FwcCcsIFsnaW9uaWMnLCAnbmdDb3Jkb3ZhJywgJ25nQW5pbWF0ZScsICdpb25pYy1wdWxsdXAnLCAnaW9uLWZsb2F0aW5nLW1lbnUnLCAnaW9uaWMuY29udHJpYi51aS50aW5kZXJDYXJkcyddKVxuXG4ucnVuKFsnJGlvbmljUGxhdGZvcm0nLFxuICAgICckc3FsaXRlU2VydmljZScsXG4gICAgZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0sICRzcWxpdGVTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBEb24ndCByZW1vdmUgdGhpcyBsaW5lIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSBhcmUgZG9pbmcuIEl0IHN0b3BzIHRoZSB2aWV3cG9ydFxuICAgICAgICAgICAgLy8gZnJvbSBzbmFwcGluZyB3aGVuIHRleHQgaW5wdXRzIGFyZSBmb2N1c2VkLiBJb25pYyBoYW5kbGVzIHRoaXMgaW50ZXJuYWxseSBmb3JcbiAgICAgICAgICAgIC8vIGEgbXVjaCBuaWNlciBrZXlib2FyZCBleHBlcmllbmNlLlxuICAgICAgICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgICAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vTG9hZCB0aGUgUHJlLXBvcHVsYXRlZCBkYXRhYmFzZSwgZGVidWcgPSB0cnVlXG4gICAgICAgICRzcWxpdGVTZXJ2aWNlLnByZWxvYWREYXRhQmFzZShmYWxzZSk7XG4gICAgfSk7XG59XSlcbi5jb25maWcoWyckc3RhdGVQcm92aWRlcicsXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgJyRpb25pY0NvbmZpZ1Byb3ZpZGVyJyxcbiAgICAnJGNvbXBpbGVQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGlvbmljQ29uZmlnUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIpIHtcblxuICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZ0cHxmaWxlfGJsb2J8Y29udGVudHxtcy1hcHB4fHgtd21hcHAwKTp8ZGF0YTppbWFnZVxcL3xpbWdcXC8vKTtcbiAgICAgICAgJGNvbXBpbGVQcm92aWRlci5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZ0cHxtYWlsdG98ZmlsZXxnaHR0cHM/fG1zLWFwcHh8eC13bWFwcDApOi8pO1xuXG4gICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiAhaW9uaWMuUGxhdGZvcm0uaXNJT1MoKSkge1xuICAgICAgICAgICAgLy9OYXRpdmUgU2Nyb2xsaW5nXG4gICAgICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5zY3JvbGxpbmcuanNTY3JvbGxpbmcoZmFsc2UpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnNjcm9sbGluZy5qc1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgfVxuXHRcdFx0XHRcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIubmF2QmFyLmFsaWduVGl0bGUoJ2NlbnRlcicpO1xuICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5iYWNrQnV0dG9uLnByZXZpb3VzVGl0bGVUZXh0KGZhbHNlKS50ZXh0KCcnKTtcbiAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIudmlld3Muc3dpcGVCYWNrRW5hYmxlZChmYWxzZSk7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2hvbWVcIixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaG9tZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lbnVDb250cm9sbGVyJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmdhbGxlcnknLCB7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9nYWxsZXJ5XCIsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9nYWxsZXJ5Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdHYWxsZXJ5Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5kcmFnb24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9kcmFnb25cIixcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2RyYWdvbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRHJhZ29uQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5zaWduYXR1cmUnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9zaWduYXR1cmVcIixcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3NpZ25hdHVyZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2lnbmF0dXJlQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cdFx0XHQuc3RhdGUoJ2FwcC5zdGFyd2FycycsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3N0YXJ3YXJzXCIsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zdGFyd2Fycy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU3RhcldhcnNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBob3RvJywge1xuICAgICAgICAgICAgICAgIHVybDogXCIvcGhvdG9cIixcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Bob3RvLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQaG90b0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudGluZGVyJywge1xuICAgICAgICAgICAgICAgIHVybDogXCIvdGluZGVyXCIsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy90aW5kZXIuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RpbmRlckNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZmxhcHB5YmlyZCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2ZsYXBweWJpcmRcIixcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2ZsYXBweWJpcmQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZsYXBweUJpcmRDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShmdW5jdGlvbigkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgdmFyICRzdGF0ZSA9ICRpbmplY3Rvci5nZXQoXCIkc3RhdGVcIik7XG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJob21lXCIpO1xuICAgICAgICB9KTtcbn1dKTtcbiIsIi8qIGdsb2JhbCBpb25pYyAqL1xyXG4oZnVuY3Rpb24gKGFuZ3VsYXIsIGlvbmljKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGlvbmljLlBsYXRmb3JtLmlzSUUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gaW9uaWMuUGxhdGZvcm0udWEudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd0cmlkZW50JykgPiAtMTtcclxuXHR9XHJcblxyXG5cdGlmIChpb25pYy5QbGF0Zm9ybS5pc0lFKCkpIHtcclxuXHRcdGFuZ3VsYXIubW9kdWxlKCdpb25pYycpXHJcblx0XHRcdC5mYWN0b3J5KCckaW9uaWNOZ0NsaWNrJywgWyckcGFyc2UnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHBhcnNlLCAkdGltZW91dCkge1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGNsaWNrRXhwcikge1xyXG5cdFx0XHRcdFx0dmFyIGNsaWNrSGFuZGxlciA9IGFuZ3VsYXIuaXNGdW5jdGlvbihjbGlja0V4cHIpID8gY2xpY2tFeHByIDogJHBhcnNlKGNsaWNrRXhwcik7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2xpY2t0aW1lcikgcmV0dXJuOyAvLyBTZWNvbmQgY2FsbFxyXG5cdFx0XHRcdFx0XHRcdGNsaWNrSGFuZGxlcihzY29wZSwgeyAkZXZlbnQ6IChldmVudCkgfSk7XHJcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2xpY2t0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVsZXRlIHNjb3BlLmNsaWNrdGltZXI7IH0sIDEsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHQvLyBIYWNrIGZvciBpT1MgU2FmYXJpJ3MgYmVuZWZpdC4gSXQgZ29lcyBzZWFyY2hpbmcgZm9yIG9uY2xpY2sgaGFuZGxlcnMgYW5kIGlzIGxpYWJsZSB0byBjbGlja1xyXG5cdFx0XHRcdFx0Ly8gc29tZXRoaW5nIGVsc2UgbmVhcmJ5LlxyXG5cdFx0XHRcdFx0ZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7IH07XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gU2VsZWN0RGlyZWN0aXZlKCkge1xyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdHJlcGxhY2U6IGZhbHNlLFxyXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAoaW9uaWMuUGxhdGZvcm0gJiYgKGlvbmljLlBsYXRmb3JtLmlzV2luZG93c1Bob25lKCkgfHwgaW9uaWMuUGxhdGZvcm0uaXNJRSgpIHx8IGlvbmljLlBsYXRmb3JtLnBsYXRmb3JtKCkgPT09IFwiZWRnZVwiKSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hdHRyKCdkYXRhLXRhcC1kaXNhYmxlZCcsICd0cnVlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2lvbmljJylcclxuICAgIC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7XHJcblxyXG5cdC8qYW5ndWxhci5tb2R1bGUoJ2lvbmljLWRhdGVwaWNrZXInKVxyXG5cdC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7Ki9cclxuXHJcbn0pKGFuZ3VsYXIsIGlvbmljKTsiLCJ3aW5kb3cucXVlcmllcyA9IFtcclxuXHRcclxuXTsiLCIoZnVuY3Rpb24oUGhhc2VyKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0RyYWdvbkNvbnRyb2xsZXInLCBEcmFnb25Db250cm9sbGVyKTtcclxuXHJcblx0RHJhZ29uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRHJhZ29uR2FtZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJ107XHJcblx0ZnVuY3Rpb24gRHJhZ29uQ29udHJvbGxlcigkc2NvcGUsIERyYWdvbkdhbWUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUpIHtcclxuXHJcblx0XHQkc2NvcGUuZ2FtZSA9IHtcclxuXHRcdFx0d2lkdGg6IFwiMTAwJVwiLFxyXG5cdFx0XHRoZWlnaHQ6IFwiMTAwJVwiLFxyXG5cdFx0XHRyZW5kZXJlcjogUGhhc2VyLkFVVE8sXHJcblx0XHRcdHN0YXRlczogW3tcclxuXHRcdFx0XHRuYW1lOiBcImJvb3RcIixcclxuXHRcdFx0XHRzdGF0ZTogYW5ndWxhci5jb3B5KERyYWdvbkdhbWUuQm9vdClcclxuXHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRuYW1lOiBcImxvYWRcIixcclxuXHRcdFx0XHRcdHN0YXRlOiBhbmd1bGFyLmNvcHkoRHJhZ29uR2FtZS5Mb2FkKVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bmFtZTogXCJwbGF5XCIsXHJcblx0XHRcdFx0XHRzdGF0ZTogYW5ndWxhci5jb3B5KERyYWdvbkdhbWUuUGxheSlcclxuXHRcdFx0XHR9XSxcclxuXHRcdFx0aW5pdFN0YXRlOiBcImJvb3RcIixcclxuXHRcdFx0bG9hZFBhdGg6IFwicmVzL2RyYWdvbi9cIlxyXG5cdFx0XHQvL2luaXRpYWxpemU6IGZhbHNlXHJcblx0XHR9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5nZXRPcGVuUmF0aW8oKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAocmF0aW8pIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5nYW1lLmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmF0aW8gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nYW1lLmluc3RhbmNlLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmF0aW8gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nYW1lLmluc3RhbmNlLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cdFx0JHNjb3BlLmZsYXNoID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vQ2FsbCBhIE1ldGhvZCBmcm9tIGEgc3RhdGUgb2YgdGhlIGdhbWVcclxuXHRcdFx0JHNjb3BlLmdhbWUuaW5zdGFuY2Uuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkubGF1bmNoTGlnaHRuaW5nKCk7XHJcblx0XHR9O1xyXG5cdH1cclxufSkoUGhhc2VyKTsiLCIoZnVuY3Rpb24oKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignRmxhcHB5QmlyZENvbnRyb2xsZXInLCBGbGFwcHlCaXJkQ29udHJvbGxlcik7XHJcblxyXG4gICAgRmxhcHB5QmlyZENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZsYXBweUJpcmRQbGF5J107XHJcbiAgICBmdW5jdGlvbiBGbGFwcHlCaXJkQ29udHJvbGxlcigkc2NvcGUsIEZsYXBweUJpcmRQbGF5KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLmlzRGVidWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLmZsYXBweWJpcmQgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuXHRcdFx0aGVpZ2h0OiBcIjEwMCVcIixcclxuXHRcdFx0cmVuZGVyZXI6IFBoYXNlci5BVVRPLFxyXG4gICAgICAgICAgICBzdGF0ZTogRmxhcHB5QmlyZFBsYXkuZ2V0U3RhdGUoJHNjb3BlKSxcclxuXHRcdFx0bG9hZFBhdGg6IFwicmVzL2ZsYXBweWJpcmQvXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS50b2dnbGVEZWJ1ZyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICRzY29wZS5pc0RlYnVnZ2luZyA9ICEkc2NvcGUuaXNEZWJ1Z2dpbmc7XHJcbiAgICAgICAgICAgICRzY29wZS5mbGFwcHliaXJkLmluc3RhbmNlLnN0YXRlLmdldEN1cnJlbnRTdGF0ZSgpLnRvZ2dsZURlYnVnKCRzY29wZS5pc0RlYnVnZ2luZyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oUGhhc2VyKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5jb250cm9sbGVyKCdHYWxsZXJ5Q29udHJvbGxlcicsIEdhbGxlcnlDb250cm9sbGVyKTtcclxuXHJcblx0R2FsbGVyeUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRpbnRlcnZhbCcsICckdGltZW91dCddO1xyXG5cdGZ1bmN0aW9uIEdhbGxlcnlDb250cm9sbGVyKCRzY29wZSwgJGludGVydmFsLCAkdGltZW91dCkge1xyXG5cdFx0XHJcblx0XHQkc2NvcGUuc3RhdGVzID0gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0XCJ0aXRsZVwiOiBcIkRyYWdvblwiLFxyXG5cdFx0XHRcdFwiaW1nXCI6IFwiaW1nL2RyYWdvbi5wbmdcIixcclxuXHRcdFx0XHRcInN0YXRlXCI6IFwiYXBwLmRyYWdvblwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcInRpdGxlXCI6IFwiU2lnbmF0dXJlXCIsXHJcblx0XHRcdFx0XCJpbWdcIjogXCJpbWcvc2lnbmF0dXJlLnBuZ1wiLFxyXG5cdFx0XHRcdFwic3RhdGVcIjogXCJhcHAuc2lnbmF0dXJlXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFwidGl0bGVcIjogXCJTdGFyIFdhcnNcIixcclxuXHRcdFx0XHRcImltZ1wiOiBcImltZy9zdGFyd2Fycy5wbmdcIixcclxuXHRcdFx0XHRcInN0YXRlXCI6IFwiYXBwLnN0YXJ3YXJzXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFwidGl0bGVcIjogXCJQaG90b1wiLFxyXG5cdFx0XHRcdFwiaW1nXCI6IFwiaW1nL3Bob3RvLnBuZ1wiLFxyXG5cdFx0XHRcdFwic3RhdGVcIjogXCJhcHAucGhvdG9cIlxyXG5cdFx0XHR9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiVGluZGVyXCIsXHJcbiAgICAgICAgICAgICAgICBcImltZ1wiOiBcImltZy90aW5kZXIucG5nXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0YXRlXCI6IFwiYXBwLnRpbmRlclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJGbGFwcHkgQmlyZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJpbWdcIjogXCJpbWcvZmxhcHB5YmlyZC5wbmdcIixcclxuICAgICAgICAgICAgICAgIFwic3RhdGVcIjogXCJhcHAuZmxhcHB5YmlyZFwiXHJcbiAgICAgICAgICAgIH1cclxuXHRcdF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gQ3JlYXRlQXJyYXlSYW5kb20oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5hbmltYXRlTnVtYmVycyA9IFBoYXNlci5BcnJheVV0aWxzLm51bWJlckFycmF5KDAsICRzY29wZS5zdGF0ZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgICRzY29wZS5hbmltYXRlTnVtYmVycy5zb3J0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5hZnRlckVudGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgQ3JlYXRlQXJyYXlSYW5kb20oKTtcclxuICAgICAgICAgICAgXHJcblx0XHRcdCRzY29wZS5jdXJyZW50SW50ZXJ2YWwgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9ICRzY29wZS5hbmltYXRlTnVtYmVycy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmKHBvc2l0aW9uID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIENyZWF0ZUFycmF5UmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSAkc2NvcGUuYW5pbWF0ZU51bWJlcnMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFN0YXRlQW5pbWF0ZSA9ICRzY29wZS5zdGF0ZXNbcG9zaXRpb25dOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUFuaW1hdGUuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGVBbmltYXRlLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICAgICAgfSwgNDAwMCk7XHJcblx0XHR9KTtcclxuICAgICAgICBcclxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmFmdGVyTGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoJHNjb3BlLmN1cnJlbnRJbnRlcnZhbCk7XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG59KShQaGFzZXIpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuXHRIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHRmdW5jdGlvbiBIb21lQ29udHJvbGxlcigkc2NvcGUsICR0aW1lb3V0KSB7XHJcblx0XHRcclxuXHRcdCRzY29wZS5hbmltYXRlTG9nbyA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyICRsb2dvID0gYW5ndWxhci5lbGVtZW50KCRldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAvL1JlbW92ZSB0aGUgYW5pbWF0aW9uIGFuZCBkZWxheVxyXG4gICAgICAgICAgICAkbG9nby5yZW1vdmVDbGFzcyhcInRhZGFcIikucmVtb3ZlQ2xhc3MoXCJhbmltYXRlZERlbGF5XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy9BbmltYXRlIGFnYWluXHJcbiAgICAgICAgICAgICAgICAkbG9nby5hZGRDbGFzcyhcInRhZGFcIik7XHJcbiAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICB9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBNZW51Q29udHJvbGxlcik7XHJcblxyXG4gICAgTWVudUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcbiAgICBmdW5jdGlvbiBNZW51Q29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICBcclxuICAgICAgICAkc2NvcGUuZXhpdEFwcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlvbmljLlBsYXRmb3JtLmV4aXRBcHAoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUGhvdG9Db250cm9sbGVyJywgUGhvdG9Db250cm9sbGVyKTtcclxuXHJcbiAgICBQaG90b0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ1Bob3RvUGxheScsICckY29yZG92YUNhbWVyYScsICdNb2RhbHMnLCAnJGlvbmljTG9hZGluZycsICckdGltZW91dCcsICckY29yZG92YVNwaW5uZXJEaWFsb2cnXTtcclxuICAgIGZ1bmN0aW9uIFBob3RvQ29udHJvbGxlcigkc2NvcGUsIFBob3RvUGxheSwgJGNvcmRvdmFDYW1lcmEsIE1vZGFscywgJGlvbmljTG9hZGluZywgJHRpbWVvdXQsICRjb3Jkb3ZhU3Bpbm5lckRpYWxvZykge1xyXG5cclxuICAgICAgICAkc2NvcGUuaW1hZ2VEYXRhID0gXCJpbWcvY2FtZXJhLnBuZ1wiO1xyXG5cclxuICAgICAgICAkc2NvcGUucGhvdG8gPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgIHN0YXRlOiBhbmd1bGFyLmNvcHkoUGhvdG9QbGF5LmdldFN0YXRlKCRzY29wZSkpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnBob3RvVG9vbCA9IHtcclxuICAgICAgICAgICAgb3B0aW9uczogW11cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudGFrZVBob3RvID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHF1YWxpdHk6IDUwLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dFZGl0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0T3JpZW50YXRpb246IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKENhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5kZXN0aW5hdGlvblR5cGUgPSBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkRBVEFfVVJMO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zb3VyY2VUeXBlID0gQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZW5jb2RpbmdUeXBlID0gQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIllvdSBuZWVkIHRlc3QgdGhlIGNhbWVyYSBpbiB0aGUgZGV2aWNlIG9yIGVtdWxhdG9yIDopXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFTcGlubmVyRGlhbG9nLnNob3cobnVsbCwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaChlcnIpe1xyXG4gICAgICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlvbi1zcGlubmVyIGNsYXNzPVwic3Bpbm5lci1jYWxtIGJpZ1NwaW5uZXJcIiBpY29uPVwicmlwcGxlXCI+PC9pb24tc3Bpbm5lcj4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlT25TdGF0ZUNoYW5nZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9GaXggdG8gc2hvdyB0aGUgbG9hZGluZyBiZWZvcmUgdG8gdGFrZSB0aGUgcGhvdG9cclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRQaG90byhpbWFnZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlcnJvclxyXG4gICAgICAgICAgICAgICAgLy9hbGVydChcIkVycm9yIHdpdGggY29yZG92YSBjYW1lcmEsIG1heWJlIHlvdSBuZWVkIGluc3RhbGwgdGhpcyBwbHVnaW4gdXNpbmcgdGhlIENMSSA6KFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGhvdG8oaW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdJbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ld0ltZ1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1nLnNyYyA9IFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCxcIiArIGltYWdlRGF0YTtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RGltZW5zaW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogaW1nLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaW1nLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9SZXNpemUgdGhlIGJpZyBpbWFnZSB1c2luZyBhIGNhbnZhcyBlbGVtZW50ISA6KVxyXG4gICAgICAgICAgICAgICAgcmVzaXplSW1hZ2UoY3VycmVudERpbWVuc2lvbnMsIDUwMCwgNTAwKTtcclxuICAgICAgICAgICAgICAgIG5ld0ltZy53aWR0aCA9IGN1cnJlbnREaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgbmV3SW1nLmhlaWdodCA9IGN1cnJlbnREaW1lbnNpb25zLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHZhciBjdHggPSBuZXdJbWcuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGN1cnJlbnREaW1lbnNpb25zLndpZHRoLCBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vTG9hZCB0aGUgaW1hZ2VcclxuICAgICAgICAgICAgICAgICRzY29wZS5waG90by5pbnN0YW5jZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5sb2FkUGhvdG8obmV3SW1nLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJykpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnNlbGVjdEZpbHRlciA9IGZ1bmN0aW9uKG9wdGlvbikge1xyXG4gICAgICAgICAgICAkc2NvcGUucGhvdG9Ub29sLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikgeyBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTsgfSk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucGhvdG8uaW5zdGFuY2Uuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkuc2VsZWN0RmlsdGVyKG9wdGlvbi5pbWFnZURhdGEpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5wcmV2aWV3UGhvdG8gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5wcmV2aWV3SW1hZ2UgPSAkc2NvcGUucGhvdG8uaW5zdGFuY2Uuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkuZ2V0SW1hZ2UoKTtcclxuICAgICAgICAgICAgTW9kYWxzLm9wZW5Nb2RhbCgkc2NvcGUsICd0ZW1wbGF0ZXMvbW9kYWxzL3ByZXZpZXdJbWFnZS5odG1sJywgJ2JvdW5jZUluUmlnaHQgYW5pbWF0ZWQnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBNb2RhbHMuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vUmVzaXplIGltYWdlIHdpdGggbWF4SGVpZ2h0IG9yIG1heEhlaWdodFxyXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUltYWdlKGltZywgbWF4SGVpZ2h0LCBtYXhXaWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgcmF0aW8gPSBtYXhIZWlnaHQgLyBtYXhXaWR0aDtcclxuICAgICAgICAgICAgaWYgKGltZy5oZWlnaHQgLyBpbWcud2lkdGggPiByYXRpbykge1xyXG4gICAgICAgICAgICAgICAgLy8gaGVpZ2h0IGlzIHRoZSBwcm9ibGVtXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1nLmhlaWdodCA+IG1heEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZy53aWR0aCA9IE1hdGgucm91bmQoaW1nLndpZHRoICogKG1heEhlaWdodCAvIGltZy5oZWlnaHQpKTtcclxuICAgICAgICAgICAgICAgICAgICBpbWcuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gd2lkdGggaXMgdGhlIHByb2JsZW1cclxuICAgICAgICAgICAgICAgIGlmIChpbWcud2lkdGggPiBtYXhIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWcuaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogKG1heFdpZHRoIC8gaW1nLndpZHRoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nLndpZHRoID0gbWF4V2lkdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5jb250cm9sbGVyKCdTaWduYXR1cmVDb250cm9sbGVyJywgU2lnbmF0dXJlQ29udHJvbGxlcik7XHJcblxyXG5cdFNpZ25hdHVyZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ1NpZ25hdHVyZVBsYXknLCAnTW9kYWxzJ107XHJcblx0ZnVuY3Rpb24gU2lnbmF0dXJlQ29udHJvbGxlcigkc2NvcGUsIFNpZ25hdHVyZVBsYXksIE1vZGFscykge1xyXG5cclxuXHRcdC8vQmFzZWQgb24gaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vZXhwbG9yaW5nLWNhbnZhcy1kcmF3aW5nLXRlY2huaXF1ZXMvXHJcblx0XHQkc2NvcGUuc2lnbmF0dXJlID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcblx0XHRcdHJlbmRlcmVyOiBQaGFzZXIuQ0FOVkFTLFxyXG5cdFx0XHRzdGF0ZTogYW5ndWxhci5jb3B5KFNpZ25hdHVyZVBsYXkpLFxyXG5cdFx0XHRpbml0aWFsaXplOiBmYWxzZVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2lnbmF0dXJlVG9vbCA9IHtcclxuXHRcdFx0bGluZVdpZHRoOiA1LFxyXG5cdFx0XHRvcHRpb25zOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aW1hZ2U6IFwicmVzL3NpZ25hdHVyZS9hc3NldHMvMS5wbmdcIixcclxuXHRcdFx0XHRcdHNlbGVjdGVkOiB0cnVlXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0aW1hZ2U6IFwicmVzL3NpZ25hdHVyZS9hc3NldHMvMi5wbmdcIlxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdGltYWdlOiBcInJlcy9zaWduYXR1cmUvYXNzZXRzLzMucG5nXCJcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRpbWFnZTogXCJyZXMvc2lnbmF0dXJlL2Fzc2V0cy80LnBuZ1wiXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0aW1hZ2U6IFwicmVzL3NpZ25hdHVyZS9hc3NldHMvNS5wbmdcIlxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdGltYWdlOiBcInJlcy9zaWduYXR1cmUvYXNzZXRzLzYucG5nXCJcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRpbWFnZTogXCJyZXMvc2lnbmF0dXJlL2Fzc2V0cy83LnBuZ1wiXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0aW1hZ2U6IFwicmVzL3NpZ25hdHVyZS9hc3NldHMvOC5wbmdcIlxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdGltYWdlOiBcInJlcy9zaWduYXR1cmUvYXNzZXRzLzkucG5nXCJcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRpbWFnZTogXCJyZXMvc2lnbmF0dXJlL2Fzc2V0cy8xMC5wbmdcIlxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdGltYWdlOiBcInJlcy9zaWduYXR1cmUvYXNzZXRzLzExLnBuZ1wiXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0aW1hZ2U6IFwicmVzL3NpZ25hdHVyZS9hc3NldHMvMTIucG5nXCJcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRpbWFnZTogXCJyZXMvc2lnbmF0dXJlL2Fzc2V0cy8xMy5wbmdcIlxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdGltYWdlOiBcInJlcy9zaWduYXR1cmUvYXNzZXRzLzE0LnBuZ1wiXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0aW1hZ2U6IFwicmVzL3NpZ25hdHVyZS9hc3NldHMvMTUucG5nXCJcclxuXHRcdFx0XHR9XVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuc2VsZWN0T3B0aW9uID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHJcblx0XHRcdCRzY29wZS5zaWduYXR1cmVUb29sLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikgeyBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTsgfSk7XHJcblx0XHRcdCRzY29wZS5zaWduYXR1cmVUb29sLm9wdGlvbnNbcG9zaXRpb25dLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdFx0JHNjb3BlLnNpZ25hdHVyZS5pbnN0YW5jZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5jaGFuZ2VPcHRpb24ocG9zaXRpb24pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2hhbmdlTGluZVdpZHRoID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCRzY29wZS5zaWduYXR1cmUuaW5zdGFuY2Uuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkuY2hhbmdlTGluZVdpZHRoKCRzY29wZS5zaWduYXR1cmVUb29sLmxpbmVXaWR0aCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5jbGVhclNpZ25hdHVyZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkc2NvcGUuc2lnbmF0dXJlLmluc3RhbmNlLnN0YXRlLmdldEN1cnJlbnRTdGF0ZSgpLmNsZWFyQ2FudmFzKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5wcmV2aWV3U2lnbmF0dXJlID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUucHJldmlld0ltYWdlID0gJHNjb3BlLnNpZ25hdHVyZS5pbnN0YW5jZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5nZXRJbWFnZSgpO1xyXG5cdFx0XHRNb2RhbHMub3Blbk1vZGFsKCRzY29wZSwgJ3RlbXBsYXRlcy9tb2RhbHMvcHJldmlld0ltYWdlLmh0bWwnLCAnYm91bmNlSW5SaWdodCBhbmltYXRlZCcpO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRNb2RhbHMuY2xvc2VNb2RhbCgpO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0JHNjb3BlLiRvbignJGlvbmljVmlldy5hZnRlckVudGVyJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkc2NvcGUuc2lnbmF0dXJlLmhlaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lnbmF0dXJlXCIpLmNsaWVudEhlaWdodDtcclxuXHRcdFx0JHNjb3BlLnNpZ25hdHVyZS5pbml0aWFsaXplID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRzY29wZS5zaWduYXR1cmVUb29sLmxpbmVXaWR0aCA9IDU7XHJcbiAgICAgICAgICAgICRzY29wZS5zaWduYXR1cmVUb29sLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcHRpb24pIHsgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7IH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2lnbmF0dXJlVG9vbC5vcHRpb25zWzBdLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5jb250cm9sbGVyKCdTdGFyV2Fyc0NvbnRyb2xsZXInLCBTdGFyV2Fyc0NvbnRyb2xsZXIpO1xyXG5cclxuXHRTdGFyV2Fyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ1N0YXJXYXJzUGxheSddO1xyXG5cdGZ1bmN0aW9uIFN0YXJXYXJzQ29udHJvbGxlcigkc2NvcGUsIFN0YXJXYXJzUGxheSkge1xyXG5cdFx0XHJcblx0XHQkc2NvcGUuc3RhcndhcnMgPSB7XHJcblx0XHRcdHdpZHRoOiBcIjEwMCVcIixcclxuXHRcdFx0aGVpZ2h0OiBcIjEwMCVcIixcclxuXHRcdFx0cmVuZGVyZXI6IFBoYXNlci5BVVRPLFxyXG5cdFx0XHRzdGF0ZTogYW5ndWxhci5jb3B5KFN0YXJXYXJzUGxheSksXHJcblx0XHRcdHRyYW5zcGFyZW50OiB0cnVlLFxyXG5cdFx0XHRpbml0aWFsaXplOiBmYWxzZSxcclxuICAgICAgICAgICAgbG9hZFBhdGg6IFwicmVzL3N0YXJ3YXJzL1wiXHJcblx0XHR9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuYWZ0ZXJFbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JHNjb3BlLnN0YXJ3YXJzLmhlaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcndhcnNcIikuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHQkc2NvcGUuc3RhcndhcnMud2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ3YXJzXCIpLmNsaWVudFdpZHRoO1xyXG5cdFx0XHQkc2NvcGUuc3RhcndhcnMuaW5pdGlhbGl6ZSA9IHRydWU7XHJcblx0XHR9KTtcclxuICAgICAgICBcclxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmFmdGVyTGVhdmUnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN0YXJ3YXJzM0RcIikpLnJlbW92ZUNsYXNzKFwic3RhcndhcnMzRFwiKTtcclxuICAgICAgICB9KTtcclxuXHR9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RpbmRlckNvbnRyb2xsZXInLCBUaW5kZXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBUaW5kZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdUaW5kZXJQbGF5J107XHJcbiAgICBmdW5jdGlvbiBUaW5kZXJDb250cm9sbGVyKCRzY29wZSwgVGluZGVyUGxheSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS50aW5kZXIgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuXHRcdFx0aGVpZ2h0OiBcIjEwMCVcIixcclxuXHRcdFx0cmVuZGVyZXI6IFBoYXNlci5BVVRPLFxyXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICAgICAgc3RhdGU6IFRpbmRlclBsYXksXHJcblx0XHRcdGxvYWRQYXRoOiBcInJlcy90aW5kZXIvXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjYXJkc0NvcHkgPSBbXHJcbiAgICAgICAgICAgIHsgaW1hZ2U6ICdpbWcvZHJhZ29uLnBuZycgfSxcclxuICAgICAgICAgICAgeyBpbWFnZTogJ2ltZy9zaWduYXR1cmUucG5nJyB9LFxyXG4gICAgICAgICAgICB7IGltYWdlOiAnaW1nL3N0YXJ3YXJzLnBuZycgfSxcclxuICAgICAgICAgICAgeyBpbWFnZTogJ2ltZy9waG90by5wbmcnIH0sXHJcbiAgICAgICAgICAgIHsgaW1hZ2U6ICdpbWcvdGluZGVyLnBuZycgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLmZpbGxDYXJkcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jYXJkcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNhcmRzQ29weSwgMCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS50aW5kZXIuaW5zdGFuY2Uuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkuc3RvcCgpO1xyXG4gICAgICAgICAgICB9LCA0MDAwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS5jYXJkRGVzdHJveWVkID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNhcmRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighJHNjb3BlLmNhcmRzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudGluZGVyLmluc3RhbmNlLnN0YXRlLmdldEN1cnJlbnRTdGF0ZSgpLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5maWxsQ2FyZHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLmNhcmRTd2lwZWRMZWZ0ID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGNhcmQgPSAkc2NvcGUuY2FyZHNbaW5kZXhdO1xyXG4gICAgICAgICAgICAkc2NvcGUudGluZGVyLmluc3RhbmNlLnN0YXRlLmdldEN1cnJlbnRTdGF0ZSgpLmRpc2xpa2UoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5jYXJkU3dpcGVkUmlnaHQgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgY2FyZCA9ICRzY29wZS5jYXJkc1tpbmRleF07XHJcbiAgICAgICAgICAgICRzY29wZS50aW5kZXIuaW5zdGFuY2Uuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkubGlrZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JHNjb3BlLmNhcmRzID0gW107XHJcbiAgICAgICAgICAgICRzY29wZS5maWxsQ2FyZHMoKTtcclxuXHRcdH0pO1xyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZGlyZWN0aXZlKCdkaXNhYmxlU2lkZU1lbnUnLCBkaXNhYmxlU2lkZU1lbnUpO1xyXG5cclxuXHRkaXNhYmxlU2lkZU1lbnUuJGluamVjdCA9IFsnJGlvbmljR2VzdHVyZScsICckaW9uaWNTaWRlTWVudURlbGVnYXRlJ107XHJcblx0ZnVuY3Rpb24gZGlzYWJsZVNpZGVNZW51KCRpb25pY0dlc3R1cmUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUpIHtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgJGlvbmljR2VzdHVyZS5vbigndG91Y2gnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5jYW5EcmFnQ29udGVudChmYWxzZSk7XHJcbiAgICAgICAgICAgIH0sIGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgJGlvbmljR2VzdHVyZS5vbigncmVsZWFzZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLmNhbkRyYWdDb250ZW50KHRydWUpO1xyXG4gICAgICAgICAgICB9LCBlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZGlzYWJsZVRvdWNoTW92ZScsIGRpc2FibGVUb3VjaE1vdmUpO1xyXG4gICAgICAgIFxyXG4gICAgZnVuY3Rpb24gZGlzYWJsZVRvdWNoTW92ZSgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmRpcmVjdGl2ZSgnaG9sZExpc3QnLCBob2xkTGlzdCk7XHJcblxyXG5cdGhvbGRMaXN0LiRpbmplY3QgPSBbJyRpb25pY0dlc3R1cmUnXTtcclxuXHRmdW5jdGlvbiBob2xkTGlzdCgkaW9uaWNHZXN0dXJlKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRcdCRpb25pY0dlc3R1cmUub24oJ2hvbGQnLCBmdW5jdGlvbiAoZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcuaXRlbS1jb250ZW50Jyk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGJ1dHRvbnMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRcdHZhciBidXR0b25zV2lkdGggPSBidXR0b25zLm9mZnNldFdpZHRoO1xyXG5cclxuXHRcdFx0XHRcdGlvbmljLnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQuc3R5bGVbaW9uaWMuQ1NTLlRSQU5TSVRJT05dID0gJ2FsbCBlYXNlLW91dCAuMjVzJztcclxuXHJcblx0XHRcdFx0XHRcdGlmICghYnV0dG9ucy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmlzaWJsZScpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnV0dG9ucy5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuXHRcdFx0XHRcdFx0XHR9LCAyNTApO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGJ1dHRvbnMuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICd0cmFuc2xhdGUzZCgtJyArIGJ1dHRvbnNXaWR0aCArICdweCwgMCwgMCknO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0XHRcdH0sIGVsZW1lbnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIvKipcclxuKiBAYXV0aG9yICAgICAgIEp1YW4gRGF2aWQgTmljaG9sbHMgQ2FyZG9uYSA8amRuaWNob2xsc2NAaG90bWFpbC5jb20+XHJcbiogQGNvcHlyaWdodCAgICAyMDE2IEp1YW4gRGF2aWQgTmljaG9sbHMgQ2FyZG9uYVxyXG4qIEBsaWNlbnNlICAgICAge0BsaW5rIGh0dHA6Ly9jaG9vc2VhbGljZW5zZS5jb20vbGljZW5zZXMvbm8tbGljZW5zZS98Tm8gTGljZW5zZX1cclxuKiBAdmVyc2lvbiAgICAgIDEuMC4wIC0gMjAxNi0wNC0wNVxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIFRoZSBJb25QaGFzZXIgcGx1Z2luLlxyXG4gKiBcclxuICogV2l0aCB0aGlzIEFuZ3VsYXIgZGlyZWN0aXZlIHlvdSBjYW4gaW50ZWdyYXRlIFBoYXNlciBGcmFtZXdvcmsgd2l0aCBJb25pYy5cclxuICpcclxuICovXHJcbihmdW5jdGlvbiAoUGhhc2VyKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmRpcmVjdGl2ZSgnaW9uUGhhc2VyJywgaW9uUGhhc2VyKTtcclxuXHJcblx0aW9uUGhhc2VyLiRpbmplY3QgPSBbJyRpb25pY0hpc3RvcnknLCAnJHRpbWVvdXQnXTtcclxuXHRmdW5jdGlvbiBpb25QaGFzZXIoJGlvbmljSGlzdG9yeSwgJHRpbWVvdXQpIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxyXG5cdFx0XHRzY29wZToge1xyXG5cdFx0XHRcdGdhbWU6IFwiPVwiXHJcblx0XHRcdH0sXHJcblx0XHRcdHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxyXG5cdFx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsIGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50KSB7XHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGluaXRpYWxpemVkIC0gVG8gaW5pdGlhbGl6ZSB0aGUgcGx1Z2luIG1hbnVhbGx5LlxyXG4gICAgICAgICAgICAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgICAgICAgICAgICAqL1xyXG5cdFx0XHRcdHNlbGYuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBjdXJyZW50U3RhdGUgLSBUaGUgY3VycmVudCBzdGF0ZSBuYW1lLlxyXG4gICAgICAgICAgICAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgICAgICAgICAgICAqL1xyXG5cdFx0XHRcdHNlbGYuY3VycmVudFN0YXRlID0gJGlvbmljSGlzdG9yeS5jdXJyZW50U3RhdGVOYW1lKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSW5pdGlhbGl6ZSB0aGUgcGx1Z2luIHdpdGggdGhlICdnYW1lJyBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIFRoZSAnZ2FtZScgT2JqZWN0IGlzIGNyZWF0ZWQgZnJvbSB0aGUgdmlldyBBbmd1bGFyIENvbnRyb2xsZXIuXHJcbiAgICAgICAgICAgICAgICAgKiBcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cdFx0XHRcdHNlbGYuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUuZ2FtZS5zdGF0ZSAmJiAkc2NvcGUuZ2FtZS5sb2FkUGF0aCAmJiAhJHNjb3BlLmdhbWUuc3RhdGUuaW9uUGhhc2VyUmVhbFByZWxvYWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZS5zdGF0ZS5pb25QaGFzZXJSZWFsUHJlbG9hZCA9ICRzY29wZS5nYW1lLnN0YXRlLnByZWxvYWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5nYW1lLnN0YXRlLnByZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUubG9hZC5wYXRoID0gJHNjb3BlLmdhbWUubG9hZFBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlvblBoYXNlclJlYWxQcmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG5cdFx0XHRcdFx0JHNjb3BlLmdhbWUuaW5zdGFuY2UgPSBuZXcgUGhhc2VyLkdhbWUoJHNjb3BlLmdhbWUud2lkdGgsXHJcblx0XHRcdFx0XHRcdCRzY29wZS5nYW1lLmhlaWdodCxcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmdhbWUucmVuZGVyZXIsXHJcblx0XHRcdFx0XHRcdCRzY29wZS5nYW1lLnBhcmVudCB8fCAkZWxlbWVudFswXSxcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmdhbWUuc3RhdGUsXHJcblx0XHRcdFx0XHRcdCRzY29wZS5nYW1lLnRyYW5zcGFyZW50LFxyXG5cdFx0XHRcdFx0XHQkc2NvcGUuZ2FtZS5hbnRpYWxpYXMsXHJcblx0XHRcdFx0XHRcdCRzY29wZS5nYW1lLnBoeXNpY3NDb25maWcpO1xyXG5cclxuXHRcdFx0XHRcdGlmICgkc2NvcGUuZ2FtZS5zdGF0ZXMpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZ2FtZS5zdGF0ZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgY3VycmVudFN0YXRlID0gJHNjb3BlLmdhbWUuc3RhdGVzW2ldO1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkc2NvcGUuZ2FtZS5sb2FkUGF0aCAmJiBjdXJyZW50U3RhdGUuc3RhdGUucHJlbG9hZCAmJiAhY3VycmVudFN0YXRlLnN0YXRlLmlvblBoYXNlclJlYWxQcmVsb2FkKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Y3VycmVudFN0YXRlLnN0YXRlLmlvblBoYXNlclJlYWxQcmVsb2FkID0gY3VycmVudFN0YXRlLnN0YXRlLnByZWxvYWQ7XHJcblx0XHRcdFx0XHRcdFx0XHRjdXJyZW50U3RhdGUuc3RhdGUucHJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5nYW1lLmxvYWQucGF0aCA9ICRzY29wZS5nYW1lLmxvYWRQYXRoO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmlvblBoYXNlclJlYWxQcmVsb2FkKCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuZ2FtZS5pbnN0YW5jZS5zdGF0ZS5hZGQoY3VycmVudFN0YXRlLm5hbWUsIGN1cnJlbnRTdGF0ZS5zdGF0ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0JHNjb3BlLmdhbWUuaW5zdGFuY2Uuc3RhdGUuc3RhcnQoJHNjb3BlLmdhbWUuaW5pdFN0YXRlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENyZWF0ZSBhIG5ldyBQaGFzZXIgaW5zdGFuY2Ugd2hlbiB0aGUgaW5pdGlhbGl6ZWQgcHJvcGVydHkgY2hhbmdlIHRvICd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goXCJnYW1lLmluaXRpYWxpemVcIiwgZnVuY3Rpb24gKGluaXRpYWxpemUpIHtcclxuXHRcdFx0XHRcdGlmIChpbml0aWFsaXplICE9PSBmYWxzZSAmJiAhc2VsZi5pbml0aWFsaXplZCkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0c2VsZi5pbml0aWFsaXplKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDcmVhdGUgYSBuZXcgUGhhc2VyIGluc3RhbmNlIHdoZW4gSW9uaWMgbmF2aWdhdGUgdG8gdGhlIHBhcmVudCB2aWV3LlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cdFx0XHRcdCRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuXHRcdFx0XHRcdGlmICh0b1N0YXRlLm5hbWUgPT0gc2VsZi5jdXJyZW50U3RhdGUgJiYgdG9TdGF0ZS5jYWNoZSAhPT0gZmFsc2UgJiYgc2VsZi5pbml0aWFsaXplZCkge1xyXG5cdFx0XHRcdFx0XHRzZWxmLmluaXRpYWxpemUoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERlc3Ryb3kgdGhlIGNhbnZhcyB3aGVuIElvbmljIG5hdmlnYXRlIHRvIG90aGVyIHZpZXcuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICovXHJcblx0XHRcdFx0JHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuXHRcdFx0XHRcdHZhciBzZWNvbmRzID0gNDUwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b1N0YXRlLm5hdGl2ZVRyYW5zaXRpb25zICYmIHRvU3RhdGUubmF0aXZlVHJhbnNpdGlvbnMuZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyA9IHRvU3RhdGUubmF0aXZlVHJhbnNpdGlvbnMuZHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZHMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZS5pbnN0YW5jZS5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZS5pbnN0YW5jZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHNlY29uZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2FtZS5pbnN0YW5jZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XVxyXG5cdFx0fTtcclxuXHJcblx0fVxyXG59KShQaGFzZXIpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmRpcmVjdGl2ZSgnaW9uTXVsdGlwbGVTZWxlY3QnLCBpb25NdWx0aXBsZVNlbGVjdCk7XHJcblxyXG5cdGlvbk11bHRpcGxlU2VsZWN0LiRpbmplY3QgPSBbJyRpb25pY01vZGFsJywgJyRpb25pY0dlc3R1cmUnXTtcclxuXHRmdW5jdGlvbiBpb25NdWx0aXBsZVNlbGVjdCgkaW9uaWNNb2RhbCwgJGlvbmljR2VzdHVyZSkge1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdHNjb3BlOiB7XHJcblx0XHRcdFx0b3B0aW9uczogXCI9XCJcclxuXHRcdFx0fSxcclxuXHRcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG5cdFx0XHRcdCRzY29wZS5tdWx0aXBsZVNlbGVjdCA9IHtcclxuXHRcdFx0XHRcdHRpdGxlOiAkYXR0cnMudGl0bGUgfHwgXCJTZWxlY3QgT3B0aW9uc1wiLFxyXG5cdFx0XHRcdFx0dGVtcE9wdGlvbnM6IFtdLFxyXG5cdFx0XHRcdFx0a2V5UHJvcGVydHk6ICRhdHRycy5rZXlQcm9wZXJ0eSB8fCBcImlkXCIsXHJcblx0XHRcdFx0XHR2YWx1ZVByb3BlcnR5OiAkYXR0cnMudmFsdWVQcm9wZXJ0eSB8fCBcInZhbHVlXCIsXHJcblx0XHRcdFx0XHRzZWxlY3RlZFByb3BlcnR5OiAkYXR0cnMuc2VsZWN0ZWRQcm9wZXJ0eSB8fCBcInNlbGVjdGVkXCIsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd0ZW1wbGF0ZXMvbXVsdGlwbGVTZWxlY3QuaHRtbCcsXHJcblx0XHRcdFx0XHRyZW5kZXJDaGVja2JveDogJGF0dHJzLnJlbmRlckNoZWNrYm94ID8gJGF0dHJzLnJlbmRlckNoZWNrYm94ID09IFwidHJ1ZVwiIDogdHJ1ZSxcclxuXHRcdFx0XHRcdGFuaW1hdGlvbjogJGF0dHJzLmFuaW1hdGlvbiB8fCAnc2xpZGUtaW4tdXAnXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVVybCkge1xyXG5cdFx0XHRcdFx0JGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XHJcblx0XHRcdFx0XHRcdHNjb3BlOiAkc2NvcGUsXHJcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJHNjb3BlLm11bHRpcGxlU2VsZWN0LmFuaW1hdGlvblxyXG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsID0gbW9kYWw7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5zaG93KCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBPcHRpb25zID0gJHNjb3BlLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcclxuXHRcdFx0XHRcdFx0dmFyIHRlbXBPcHRpb24gPSB7fTtcclxuXHRcdFx0XHRcdFx0dGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV07XHJcblx0XHRcdFx0XHRcdHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnZhbHVlUHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC52YWx1ZVByb3BlcnR5XTtcclxuXHRcdFx0XHRcdFx0dGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV0gPSBvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldO1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRlbXBPcHRpb247XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUoJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBsYXRlVXJsKTtcclxuXHRcdFx0XHR9LCAkZWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5zYXZlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBPcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciB0ZW1wT3B0aW9uID0gJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBPcHRpb25zW2ldO1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8ICRzY29wZS5vcHRpb25zLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9wdGlvbiA9ICRzY29wZS5vcHRpb25zW2pdO1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV0gPT0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV0gPSB0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XTtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwoKTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0aWYgKCRzY29wZS5tb2RhbCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmRpcmVjdGl2ZSgnaW9uU2VhcmNoU2VsZWN0JywgaW9uU2VhcmNoU2VsZWN0KTtcclxuXHJcblx0aW9uU2VhcmNoU2VsZWN0LiRpbmplY3QgPSBbJyRpb25pY01vZGFsJywgJyRpb25pY0dlc3R1cmUnXTtcclxuXHRmdW5jdGlvbiBpb25TZWFyY2hTZWxlY3QoJGlvbmljTW9kYWwsICRpb25pY0dlc3R1cmUpIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHRzY29wZToge1xyXG5cdFx0XHRcdG9wdGlvbnM6IFwiPVwiLFxyXG5cdFx0XHRcdG9wdGlvblNlbGVjdGVkOiBcIj1cIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XHJcblx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdCA9IHtcclxuXHRcdFx0XHRcdHRpdGxlOiAkYXR0cnMudGl0bGUgfHwgXCJTZWFyY2hcIixcclxuXHRcdFx0XHRcdGtleVByb3BlcnR5OiAkYXR0cnMua2V5UHJvcGVydHksXHJcblx0XHRcdFx0XHR2YWx1ZVByb3BlcnR5OiAkYXR0cnMudmFsdWVQcm9wZXJ0eSxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAkYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3RlbXBsYXRlcy9zZWFyY2hTZWxlY3QuaHRtbCcsXHJcblx0XHRcdFx0XHRhbmltYXRpb246ICRhdHRycy5hbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJyxcclxuXHRcdFx0XHRcdG9wdGlvbjogbnVsbCxcclxuXHRcdFx0XHRcdHNlYXJjaHZhbHVlOiBcIlwiLFxyXG5cdFx0XHRcdFx0ZW5hYmxlU2VhcmNoOiAkYXR0cnMuZW5hYmxlU2VhcmNoID8gJGF0dHJzLmVuYWJsZVNlYXJjaCA9PSBcInRydWVcIiA6IHRydWVcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xyXG5cclxuXHRcdFx0XHRcdGlmICghISRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHkgJiYgISEkc2NvcGUuc2VhcmNoU2VsZWN0LnZhbHVlUHJvcGVydHkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5vcHRpb25TZWxlY3RlZCkge1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uID0gJHNjb3BlLm9wdGlvblNlbGVjdGVkWyRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHldO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb24gPSAkc2NvcGUub3B0aW9uU2VsZWN0ZWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlKCRzY29wZS5zZWFyY2hTZWxlY3QudGVtcGxhdGVVcmwpO1xyXG5cdFx0XHRcdH0sICRlbGVtZW50KTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLnNhdmVPcHRpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRpZiAoISEkc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5ICYmICEhJHNjb3BlLnNlYXJjaFNlbGVjdC52YWx1ZVByb3BlcnR5KSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgY3VycmVudE9wdGlvbiA9ICRzY29wZS5vcHRpb25zW2ldO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChjdXJyZW50T3B0aW9uWyRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHldID09ICRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUub3B0aW9uU2VsZWN0ZWQgPSBjdXJyZW50T3B0aW9uO1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm9wdGlvblNlbGVjdGVkID0gJHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0LnNlYXJjaHZhbHVlID0gXCJcIjtcclxuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuY2xlYXJTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0LnNlYXJjaHZhbHVlID0gXCJcIjtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdCRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0aWYgKCRzY29wZS5tb2RhbCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGVVcmwpIHtcclxuXHRcdFx0XHRcdCRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGF0ZVVybCwge1xyXG5cdFx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxyXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICRzY29wZS5zZWFyY2hTZWxlY3QuYW5pbWF0aW9uXHJcblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwgPSBtb2RhbDtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnNob3coKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbihQaGFzZXIpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRGVmYXVsdEJvb3QnLCBEZWZhdWx0Qm9vdCk7XHJcblxyXG5cdERlZmF1bHRCb290LiRpbmplY3QgPSBbXTtcclxuXHRmdW5jdGlvbiBEZWZhdWx0Qm9vdCgpIHtcclxuXHJcblx0XHR2YXIgc3RhdGUgPSB7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzQ0NDQ0NCc7XHJcblx0XHRcdFx0dGhpcy5nYW1lLnN0YXRlVHJhbnNpdGlvbiA9IHRoaXMuZ2FtZS5wbHVnaW5zLmFkZChQaGFzZXIuUGx1Z2luLlN0YXRlVHJhbnNpdGlvbik7XHJcblx0XHRcdFx0dGhpcy5nYW1lLnN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmUoe1xyXG5cdFx0XHRcdFx0ZHVyYXRpb246IFBoYXNlci5UaW1lci5TRUNPTkQgKiAwLjgsXHJcblx0XHRcdFx0XHRlYXNlOiBQaGFzZXIuRWFzaW5nLkV4cG9uZW50aWFsLkluT3V0LFxyXG5cdFx0XHRcdFx0cHJvcGVydGllczoge1xyXG5cdFx0XHRcdFx0XHRhbHBoYTogMCxcclxuXHRcdFx0XHRcdFx0c2NhbGU6IHtcclxuXHRcdFx0XHRcdFx0XHR4OiAxLjQsXHJcblx0XHRcdFx0XHRcdFx0eTogMS40XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDE7XHJcblx0XHRcdFx0dGhpcy5zdGFnZS5kaXNhYmxlVmlzaWJpbGl0eUNoYW5nZSA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlJFU0laRTtcclxuXHRcdFx0XHR0aGlzLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLkVYQUNUX0ZJVDtcclxuXHRcdFx0fSxcclxuXHRcdFx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2xvYWRpbmcnLCAnYXNzZXRzL2xvYWRpbmcucG5nJyk7XHJcblx0XHRcdFx0dGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2xvYWRpbmdib3JkZXInLCAnYXNzZXRzL2xvYWRpbmdib3JkZXIucG5nJyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbG9hZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBzdGF0ZTtcclxuXHR9XHJcbn0pKFBoYXNlcik7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnTW9kYWxzJywgTW9kYWxzKTtcclxuXHJcblx0TW9kYWxzLiRpbmplY3QgPSBbJyRpb25pY01vZGFsJ107XHJcblx0ZnVuY3Rpb24gTW9kYWxzKCRpb25pY01vZGFsKSB7XHJcblxyXG5cdFx0dmFyIG1vZGFscyA9IFtdO1xyXG5cclxuXHRcdHZhciBfb3Blbk1vZGFsID0gZnVuY3Rpb24gKCRzY29wZSwgdGVtcGxhdGVVcmwsIGFuaW1hdGlvbikge1xyXG5cdFx0XHQkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcclxuXHRcdFx0XHRzY29wZTogJHNjb3BlLFxyXG5cdFx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCcsXHJcblx0XHRcdFx0YmFja2Ryb3BDbGlja1RvQ2xvc2U6IGZhbHNlXHJcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XHJcblx0XHRcdFx0bW9kYWxzLnB1c2gobW9kYWwpO1xyXG5cdFx0XHRcdG1vZGFsLnNob3coKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRNb2RhbCA9IG1vZGFscy5zcGxpY2UoLTEsIDEpWzBdO1xyXG5cdFx0XHRjdXJyZW50TW9kYWwucmVtb3ZlKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfY2xvc2VBbGxNb2RhbHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdG1vZGFscy5tYXAoZnVuY3Rpb24gKG1vZGFsKSB7XHJcblx0XHRcdFx0bW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRtb2RhbHMgPSBbXTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0b3Blbk1vZGFsOiBfb3Blbk1vZGFsLFxyXG5cdFx0XHRjbG9zZU1vZGFsOiBfY2xvc2VNb2RhbCxcclxuXHRcdFx0Y2xvc2VBbGxNb2RhbHM6IF9jbG9zZUFsbE1vZGFsc1xyXG5cdFx0fTtcclxuXHR9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnTW9kZWwnLCBNb2RlbCk7XHJcblxyXG5cdE1vZGVsLiRpbmplY3QgPSBbJ1VzZXJzJ107XHJcblx0ZnVuY3Rpb24gTW9kZWwoVXNlcnMpIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRVc2VyczogVXNlcnNcclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LnNlcnZpY2UoJyRzcWxpdGVTZXJ2aWNlJywgJHNxbGl0ZVNlcnZpY2UpO1xyXG5cclxuXHQkc3FsaXRlU2VydmljZS4kaW5qZWN0ID0gWyckcScsICckY29yZG92YVNRTGl0ZSddO1xyXG5cdGZ1bmN0aW9uICRzcWxpdGVTZXJ2aWNlKCRxLCAkY29yZG92YVNRTGl0ZSkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHZhciBfZGI7XHJcblxyXG5cdFx0c2VsZi5kYiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCFfZGIpIHtcclxuXHRcdFx0XHRpZiAod2luZG93LnNxbGl0ZVBsdWdpbiAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRfZGIgPSB3aW5kb3cuc3FsaXRlUGx1Z2luLm9wZW5EYXRhYmFzZSh7IG5hbWU6IFwicHJlLmRiXCIsIGxvY2F0aW9uOiAyLCBjcmVhdGVGcm9tTG9jYXRpb246IDEgfSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIEZvciBkZWJ1Z2dpbmcgaW4gdGhlIGJyb3dzZXJcclxuXHRcdFx0XHRcdF9kYiA9IHdpbmRvdy5vcGVuRGF0YWJhc2UoXCJwcmUuZGJcIiwgXCIxLjBcIiwgXCJEYXRhYmFzZVwiLCAyMDAwMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gX2RiO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLmdldEZpcnN0SXRlbSA9IGZ1bmN0aW9uIChxdWVyeSwgcGFyYW1ldGVycykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cdFx0XHRzZWxmLmV4ZWN1dGVTcWwocXVlcnksIHBhcmFtZXRlcnMpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRpZiAocmVzLnJvd3MubGVuZ3RoID4gMClcclxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlcy5yb3dzLml0ZW0oMCkpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZWplY3QoXCJUaGVyZSBhcmVuJ3QgaXRlbXMgbWF0Y2hpbmdcIik7XHJcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVqZWN0KGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYuZ2V0Rmlyc3RPckRlZmF1bHRJdGVtID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYXJhbWV0ZXJzKSB7XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblx0XHRcdHNlbGYuZXhlY3V0ZVNxbChxdWVyeSwgcGFyYW1ldGVycykudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdGlmIChyZXMucm93cy5sZW5ndGggPiAwKVxyXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzLnJvd3MuaXRlbSgwKSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVqZWN0KGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYuZ2V0SXRlbXMgPSBmdW5jdGlvbiAocXVlcnksIHBhcmFtZXRlcnMpIHtcclxuXHRcdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRcdFx0c2VsZi5leGVjdXRlU3FsKHF1ZXJ5LCBwYXJhbWV0ZXJzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHR2YXIgaXRlbXMgPSBbXTtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRpdGVtcy5wdXNoKHJlcy5yb3dzLml0ZW0oaSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShpdGVtcyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVqZWN0KGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucHJlbG9hZERhdGFCYXNlID0gZnVuY3Rpb24gKGVuYWJsZUxvZykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuXHRcdFx0Ly93aW5kb3cub3BlbihcImRhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LFwiICsgSlNPTi5zdHJpbmdpZnkoeyBkYXRhOiB3aW5kb3cucXVlcmllcy5qb2luKCcnKS5yZXBsYWNlKC9cXFxcbi9nLCAnXFxuJykgfSkpO1xyXG5cdFx0XHRpZiAod2luZG93LnNxbGl0ZVBsdWdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0ZW5hYmxlTG9nICYmIGNvbnNvbGUubG9nKCclYyAqKioqKioqKioqKioqKioqKiBTdGFydGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIGRhdGFiYXNlIGluIHRoZSBicm93c2VyICoqKioqKioqKioqKioqKioqICcsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2JhZGE1NScpO1xyXG5cdFx0XHRcdHNlbGYuZGIoKS50cmFuc2FjdGlvbihmdW5jdGlvbiAodHgpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgd2luZG93LnF1ZXJpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIHF1ZXJ5ID0gd2luZG93LnF1ZXJpZXNbaV0ucmVwbGFjZSgvXFxcXG4vZywgJ1xcbicpO1xyXG5cclxuXHRcdFx0XHRcdFx0ZW5hYmxlTG9nICYmIGNvbnNvbGUubG9nKHdpbmRvdy5xdWVyaWVzW2ldKTtcclxuXHRcdFx0XHRcdFx0dHguZXhlY3V0ZVNxbChxdWVyeSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGVuYWJsZUxvZyAmJiBjb25zb2xlLmxvZygnJWMgKioqKioqKioqKioqKioqKiogQ29tcGxldGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIGRhdGFiYXNlIGluIHRoZSBicm93c2VyICoqKioqKioqKioqKioqKioqICcsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2JhZGE1NScpO1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShcIk9LXCIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoXCJPS1wiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYuZXhlY3V0ZVNxbCA9IGZ1bmN0aW9uIChxdWVyeSwgcGFyYW1ldGVycykge1xyXG5cdFx0XHRyZXR1cm4gJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShzZWxmLmRiKCksIHF1ZXJ5LCBwYXJhbWV0ZXJzKTtcclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ1VzZXJzJywgVXNlcnMpO1xyXG5cclxuXHRVc2Vycy4kaW5qZWN0ID0gWyckcScsICckc3FsaXRlU2VydmljZSddO1xyXG5cdGZ1bmN0aW9uIFVzZXJzKCRxLCAkc3FsaXRlU2VydmljZSkge1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGdldEFsbDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBxdWVyeSA9IFwiU2VsZWN0ICogRlJPTSBVc2Vyc1wiO1xyXG5cdFx0XHRcdHJldHVybiAkcS53aGVuKCRzcWxpdGVTZXJ2aWNlLmdldEl0ZW1zKHF1ZXJ5KSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFkZDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0XHR2YXIgcXVlcnkgPSBcIklOU0VSVCBJTlRPIFVzZXJzIChOYW1lKSBWQUxVRVMgKD8pXCI7XHJcblx0XHRcdFx0cmV0dXJuICRxLndoZW4oJHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVNxbChxdWVyeSwgW3VzZXIuTmFtZV0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRHJhZ29uR2FtZScsIERyYWdvbkdhbWUpO1xyXG5cclxuXHREcmFnb25HYW1lLiRpbmplY3QgPSBbJ0RlZmF1bHRCb290JywgJ0RyYWdvbkxvYWQnLCAnRHJhZ29uUGxheSddO1xyXG5cdGZ1bmN0aW9uIERyYWdvbkdhbWUoRGVmYXVsdEJvb3QsIERyYWdvbkxvYWQsIERyYWdvblBsYXkpIHtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Qm9vdDogRGVmYXVsdEJvb3QsXHJcblx0XHRcdExvYWQ6IERyYWdvbkxvYWQsXHJcblx0XHRcdFBsYXk6IERyYWdvblBsYXlcclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRHJhZ29uTG9hZCcsIERyYWdvbkxvYWQpO1xyXG5cclxuXHQvL0RyYWdvbkxvYWQuJGluamVjdCA9IFtdO1xyXG5cdGZ1bmN0aW9uIERyYWdvbkxvYWQoKSB7XHJcblxyXG5cdFx0dmFyIHN0YXRlID0ge1xyXG5cdFx0XHRwcmVsb2FkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmxvYWRpbmdib3JkZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgKyAxNSwgJ2xvYWRpbmdib3JkZXInKTtcclxuXHRcdFx0XHR0aGlzLmxvYWRpbmdib3JkZXIueCAtPSB0aGlzLmxvYWRpbmdib3JkZXIud2lkdGggLyAyO1xyXG5cdFx0XHRcdHRoaXMubG9hZGluZyA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLCB0aGlzLmdhbWUud29ybGQuY2VudGVyWSArIDE5LCAnbG9hZGluZycpO1xyXG5cdFx0XHRcdHRoaXMubG9hZGluZy54IC09IHRoaXMubG9hZGluZy53aWR0aCAvIDI7XHJcblx0XHRcdFx0dGhpcy5nYW1lLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLmxvYWRpbmcsIDApO1xyXG5cclxuXHRcdFx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2Nsb3VkMScsICdhc3NldHMvY2xvdWQxLnBuZycpO1xyXG5cdFx0XHRcdHRoaXMubG9hZC5pbWFnZSgnY2xvdWQyJywgJ2Fzc2V0cy9jbG91ZDIucG5nJyk7XHJcblx0XHRcdFx0dGhpcy5sb2FkLmltYWdlKCdjbG91ZDMnLCAnYXNzZXRzL2Nsb3VkMy5wbmcnKTtcclxuXHRcdFx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3JhaW5kcm9wJywgJ2Fzc2V0cy9yYWluZHJvcC5wbmcnKTtcclxuXHRcdFx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2RyYWdvbicsICdhc3NldHMvZHJhZ29uLnBuZycpO1xyXG5cdFx0XHRcdHRoaXMubG9hZC5pbWFnZSgnbW9vbicsICdhc3NldHMvbW9vbi5wbmcnKTtcclxuXHJcblx0XHRcdFx0Ly9DcmVkaXRzXHJcblx0XHRcdFx0Ly9odHRwOi8vc291bmRiaWJsZS5jb20vNTc2LUJhcnJlbC1FeHBsb2RpbmcuaHRtbFxyXG5cdFx0XHRcdC8vUmVjb3JkZWQgYnkgQmxhc3R3YXZlRnguY29tXHJcblx0XHRcdFx0Ly9CYXJyZWwgRXhwbG9kaW5nXHJcblx0XHRcdFx0dGhpcy5nYW1lLmxvYWQuYXVkaW8oJ3RodW5kZXInLCBbJ2F1ZGlvL3RodW5kZXIub2dnJywgJ2F1ZGlvL3RodW5kZXIubXAzJ10pO1xyXG5cclxuXHRcdFx0XHQvL0NyZWRpdHNcclxuXHRcdFx0XHQvL2h0dHA6Ly9zb3VuZGJpYmxlLmNvbS8yMDE2LVRodW5kZXItU3RyaWtlLTIuaHRtbFxyXG5cdFx0XHRcdC8vUmVjb3JkZWQgYnkgTWlrZSBLb2VuaWdcclxuXHRcdFx0XHQvL1RodW5kZXIgU3RyaWtlIDJcclxuXHRcdFx0XHR0aGlzLmdhbWUubG9hZC5hdWRpbygncmFpbicsIFsnYXVkaW8vcmFpbi5vZ2cnLCAnYXVkaW8vcmFpbi5tcDMnXSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZ2FtZS5sb2FkLmF1ZGlvKCdkcmFnb24nLCBbJ2F1ZGlvL2RyYWdvbi5vZ2cnLCAnYXVkaW8vZHJhZ29uLm1wMyddKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ3BsYXknKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gc3RhdGU7XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbihQaGFzZXIpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRHJhZ29uUGxheScsIERyYWdvblBsYXkpO1xyXG5cclxuXHREcmFnb25QbGF5LiRpbmplY3QgPSBbJyRjb3Jkb3ZhVmlicmF0aW9uJ107XHJcblx0ZnVuY3Rpb24gRHJhZ29uUGxheSgkY29yZG92YVZpYnJhdGlvbikge1xyXG5cclxuXHRcdHZhciBzdGF0ZSA9IHtcclxuXHRcdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0Ly9Mb2FkIGltYWdlIGRhdGEgZnJvbSBjYWNoZVxyXG5cdFx0XHRcdHZhciBpbWdDYWNoZSA9IG51bGw7XHJcblxyXG5cdFx0XHRcdHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuYWRkLmltYWdlKDAsIDAsIHRoaXMuY3JlYXRlQmcoKSk7XHJcblxyXG5cdFx0XHRcdHRoaXMubW9vbiA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLCAxMDAsICdtb29uJyk7XHJcblx0XHRcdFx0dGhpcy5tb29uLmFuY2hvci5zZXQoMC41KTtcclxuXHJcblx0XHRcdFx0dGhpcy5jbG91ZHMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG5cclxuXHRcdFx0XHRpbWdDYWNoZSA9IHRoaXMuY2FjaGUuZ2V0RnJhbWUoJ2Nsb3VkMScpO1xyXG5cdFx0XHRcdHRoaXMuY2xvdWQxID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtMTAsIGltZ0NhY2hlLndpZHRoLCBpbWdDYWNoZS5oZWlnaHQsICdjbG91ZDEnKTtcclxuXHRcdFx0XHR0aGlzLmNsb3VkMS5hdXRvU2Nyb2xsKC00MCwgMCk7XHJcblx0XHRcdFx0dGhpcy5jbG91ZDEuaW1nQ2FjaGUgPSBpbWdDYWNoZTtcclxuXHRcdFx0XHR0aGlzLmNsb3VkMS5hbHBoYSA9IDAuNTtcclxuXHRcdFx0XHR0aGlzLmNsb3Vkcy5hZGQodGhpcy5jbG91ZDEpO1xyXG5cclxuXHRcdFx0XHRpbWdDYWNoZSA9IHRoaXMuY2FjaGUuZ2V0RnJhbWUoJ2Nsb3VkMicpO1xyXG5cdFx0XHRcdHRoaXMuY2xvdWQyID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtMTAsIGltZ0NhY2hlLndpZHRoLCBpbWdDYWNoZS5oZWlnaHQsICdjbG91ZDInKTtcclxuXHRcdFx0XHR0aGlzLmNsb3VkMi5hdXRvU2Nyb2xsKC0zMCwgMCk7XHJcblx0XHRcdFx0dGhpcy5jbG91ZDIuaW1nQ2FjaGUgPSBpbWdDYWNoZTtcclxuXHRcdFx0XHR0aGlzLmNsb3VkMi5hbHBoYSA9IDAuNTtcclxuXHRcdFx0XHR0aGlzLmNsb3Vkcy5hZGQodGhpcy5jbG91ZDIpO1xyXG5cclxuXHRcdFx0XHRpbWdDYWNoZSA9IHRoaXMuY2FjaGUuZ2V0RnJhbWUoJ2Nsb3VkMycpO1xyXG5cdFx0XHRcdHRoaXMuY2xvdWQzID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAtMTAsIGltZ0NhY2hlLndpZHRoLCBpbWdDYWNoZS5oZWlnaHQsICdjbG91ZDMnKTtcclxuXHRcdFx0XHR0aGlzLmNsb3VkMy5hdXRvU2Nyb2xsKC01MCwgMCk7XHJcblx0XHRcdFx0dGhpcy5jbG91ZDMuaW1nQ2FjaGUgPSBpbWdDYWNoZTtcclxuXHRcdFx0XHR0aGlzLmNsb3Vkcy5hZGQodGhpcy5jbG91ZDMpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnNjYWxlQ2xvdWRzKHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcih0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgLTEwMCwgMzAwKTtcclxuXHRcdFx0XHR0aGlzLmVtaXR0ZXIud2lkdGggPSB0aGlzLmdhbWUud29ybGQud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5lbWl0dGVyLmFuZ2xlID0gNTtcclxuXHRcdFx0XHR0aGlzLmVtaXR0ZXIubWFrZVBhcnRpY2xlcygncmFpbmRyb3AnKTtcclxuXHRcdFx0XHR0aGlzLmVtaXR0ZXIubWluUGFydGljbGVTY2FsZSA9IDAuNztcclxuXHRcdFx0XHR0aGlzLmVtaXR0ZXIubWF4UGFydGljbGVTY2FsZSA9IDE7XHJcblx0XHRcdFx0dGhpcy5lbWl0dGVyLnNldFlTcGVlZCg2MDAsIDgwMCk7XHJcblx0XHRcdFx0dGhpcy5lbWl0dGVyLnNldFhTcGVlZCgtNSwgNSk7XHJcblx0XHRcdFx0dGhpcy5lbWl0dGVyLm1pblJvdGF0aW9uID0gMDtcclxuXHRcdFx0XHR0aGlzLmVtaXR0ZXIubWF4Um90YXRpb24gPSAwO1xyXG5cdFx0XHRcdHRoaXMuZW1pdHRlci5zdGFydChmYWxzZSwgMTYwMCwgMiwgMCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuY3JlYXRlRHJhZ29uKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMubGlnaHRuaW5nQml0bWFwID0gdGhpcy5nYW1lLmFkZC5iaXRtYXBEYXRhKDIwMCwgMTAwMCk7XHJcblx0XHRcdFx0dGhpcy5saWdodG5pbmcgPSB0aGlzLmdhbWUuYWRkLmltYWdlKHRoaXMuZ2FtZS53aWR0aCAvIDIsIDAsIHRoaXMubGlnaHRuaW5nQml0bWFwKTtcclxuXHRcdFx0XHR0aGlzLmxpZ2h0bmluZy5hbmNob3Iuc2V0VG8oMC41LCAwKTtcclxuXHJcblx0XHRcdFx0dGhpcy5mbGFzaCA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoMCwgLTEwKTtcclxuXHRcdFx0XHR0aGlzLmZsYXNoLmJlZ2luRmlsbCgweGZmZmZmZiwgMSk7XHJcblx0XHRcdFx0dGhpcy5mbGFzaC5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQgKyAyMCk7XHJcblx0XHRcdFx0dGhpcy5mbGFzaC5lbmRGaWxsKCk7XHJcblx0XHRcdFx0dGhpcy5mbGFzaC5hbHBoYSA9IDA7XHJcblxyXG5cdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5zZXRCb3VuZHMoLTEwLCAtMTAsIHRoaXMuZ2FtZS53aWR0aCArIDIwLCB0aGlzLmdhbWUuaGVpZ2h0ICsgMjApO1xyXG5cclxuXHRcdFx0XHR0aGlzLnRodW5kZXIgPSB0aGlzLmFkZC5hdWRpbygndGh1bmRlcicpO1xyXG5cdFx0XHRcdHRoaXMuZHJhZ29uUm9hciA9IHRoaXMuYWRkLmF1ZGlvKCdkcmFnb24nKTtcclxuXHRcdFx0XHR0aGlzLnJhaW4gPSB0aGlzLmFkZC5hdWRpbygncmFpbicpO1xyXG5cdFx0XHRcdHRoaXMucmFpbi5sb29wID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnJhaW4ucGxheSgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGVEcmFnb246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwb2ludHMgPSBbXTtcclxuXHRcdFx0XHR2YXIgaW1nQ2FjaGUgPSB0aGlzLmdhbWUuY2FjaGUuZ2V0RnJhbWUoJ2RyYWdvbicpO1xyXG5cdFx0XHRcdHZhciBsZW5ndGggPSBpbWdDYWNoZS53aWR0aCAvIDIwO1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMjA7IGkrKykge1xyXG5cdFx0XHRcdFx0cG9pbnRzLnB1c2gobmV3IFBoYXNlci5Qb2ludChpICogbGVuZ3RoLCAwKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuZHJhZ29uID0gdGhpcy5nYW1lLmFkZC5yb3BlKC1pbWdDYWNoZS53aWR0aCwgdGhpcy5nYW1lLndvcmxkLmNlbnRlclksICdkcmFnb24nLCBudWxsLCBwb2ludHMpO1xyXG5cdFx0XHRcdHRoaXMuZHJhZ29uLmFkaXRpb25hbEluZm8gPSB7XHJcblx0XHRcdFx0XHRjb3VudDogMCxcclxuXHRcdFx0XHRcdGRpcmVjdGlvbjogJ3JpZ2h0JyxcclxuXHRcdFx0XHRcdHJvYXI6IHRydWVcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuZHJhZ29uLnVwZGF0ZUFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dGhpcy5hZGl0aW9uYWxJbmZvLmNvdW50ICs9IDAuMTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5wb2ludHNbaV0ueSA9IE1hdGguc2luKGkgKiAwLjMgKyB0aGlzLmFkaXRpb25hbEluZm8uY291bnQpICogMTA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bGF1bmNoTGlnaHRuaW5nOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdCRjb3Jkb3ZhVmlicmF0aW9uLnZpYnJhdGUoMzAwKTtcclxuXHRcdFx0XHR9IGNhdGNoIChleGMpIHsgfVxyXG5cclxuXHRcdFx0XHR0aGlzLnRodW5kZXIucGxheSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmxpZ2h0bmluZy54ID0gdGhpcy5ybmQuaW50ZWdlckluUmFuZ2UoMCwgdGhpcy5nYW1lLndpZHRoKTtcclxuXHJcblx0XHRcdFx0dmFyIHJhbmRvbVBvc2l0aW9uID0ge1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ybmQuaW50ZWdlckluUmFuZ2UoMCwgdGhpcy5nYW1lLndpZHRoKSxcclxuXHRcdFx0XHRcdHk6IHRoaXMucm5kLmludGVnZXJJblJhbmdlKHRoaXMuZ2FtZS5oZWlnaHQgLyAyLCB0aGlzLmdhbWUuaGVpZ2h0KVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHRoaXMubGlnaHRuaW5nLnJvdGF0aW9uID1cclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS5tYXRoLmFuZ2xlQmV0d2VlbihcclxuXHRcdFx0XHRcdFx0dGhpcy5saWdodG5pbmcueCwgdGhpcy5saWdodG5pbmcueSxcclxuXHRcdFx0XHRcdFx0cmFuZG9tUG9zaXRpb24ueCwgcmFuZG9tUG9zaXRpb24ueVxyXG5cdFx0XHRcdFx0KSAtIE1hdGguUEkgLyAyO1xyXG5cclxuXHRcdFx0XHR2YXIgZGlzdGFuY2UgPSB0aGlzLmdhbWUubWF0aC5kaXN0YW5jZShcclxuXHRcdFx0XHRcdHRoaXMubGlnaHRuaW5nLngsIHRoaXMubGlnaHRuaW5nLnksXHJcblx0XHRcdFx0XHRyYW5kb21Qb3NpdGlvbi54LCByYW5kb21Qb3NpdGlvbi55XHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0dGhpcy5jcmVhdGVMaWdodG5pbmdUZXh0dXJlKHRoaXMubGlnaHRuaW5nQml0bWFwLndpZHRoIC8gMiwgMCwgMjAsIDMsIGZhbHNlLCBkaXN0YW5jZSk7XHJcblxyXG5cdFx0XHRcdHRoaXMubGlnaHRuaW5nLmFscGhhID0gMTtcclxuXHJcblx0XHRcdFx0dGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmxpZ2h0bmluZylcclxuXHRcdFx0XHRcdC50byh7IGFscGhhOiAwLjUgfSwgMTAwLCBQaGFzZXIuRWFzaW5nLkJvdW5jZS5PdXQpXHJcblx0XHRcdFx0XHQudG8oeyBhbHBoYTogMS4wIH0sIDEwMCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0KVxyXG5cdFx0XHRcdFx0LnRvKHsgYWxwaGE6IDAuNSB9LCAxMDAsIFBoYXNlci5FYXNpbmcuQm91bmNlLk91dClcclxuXHRcdFx0XHRcdC50byh7IGFscGhhOiAxLjAgfSwgMTAwLCBQaGFzZXIuRWFzaW5nLkJvdW5jZS5PdXQpXHJcblx0XHRcdFx0XHQudG8oeyBhbHBoYTogMCB9LCAyNTAsIFBoYXNlci5FYXNpbmcuQ3ViaWMuSW4pXHJcblx0XHRcdFx0XHQuc3RhcnQoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5mbGFzaC5hbHBoYSA9IDE7XHJcblx0XHRcdFx0dGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmZsYXNoKVxyXG5cdFx0XHRcdFx0LnRvKHsgYWxwaGE6IDAgfSwgMTAwLCBQaGFzZXIuRWFzaW5nLkN1YmljLkluLCB0cnVlKTtcclxuXHJcblx0XHRcdFx0Ly90aGlzLmdhbWUuY2FtZXJhLnkgPSAwO1xyXG5cdFx0XHRcdC8vdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmdhbWUuY2FtZXJhKS50byh7IHk6IC0xMCB9LCA0MCwgUGhhc2VyLkVhc2luZy5TaW51c29pZGFsLkluT3V0LCB0cnVlLCAwLCA1LCB0cnVlKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlTGlnaHRuaW5nVGV4dHVyZTogZnVuY3Rpb24oeCwgeSwgc2VnbWVudHMsIGJvbHRXaWR0aCwgYnJhbmNoLCBkaXN0YW5jZSkge1xyXG5cdFx0XHRcdHZhciBjdHggPSB0aGlzLmxpZ2h0bmluZ0JpdG1hcC5jb250ZXh0O1xyXG5cdFx0XHRcdHZhciB3aWR0aCA9IHRoaXMubGlnaHRuaW5nQml0bWFwLndpZHRoO1xyXG5cdFx0XHRcdHZhciBoZWlnaHQgPSB0aGlzLmxpZ2h0bmluZ0JpdG1hcC5oZWlnaHQ7XHJcblxyXG5cdFx0XHRcdGlmICghYnJhbmNoKSBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnRzOyBpKyspIHtcclxuXHJcblx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDI1NSwgMjU1LCAyNTUpJztcclxuXHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSBib2x0V2lkdGg7XHJcblxyXG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbyh4LCB5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoYnJhbmNoKSB7XHJcblx0XHRcdFx0XHRcdHggKz0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtMTAsIDEwKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHggKz0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtMzAsIDMwKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICh4IDw9IDEwKSB4ID0gMTA7XHJcblx0XHRcdFx0XHRpZiAoeCA+PSB3aWR0aCAtIDEwKSB4ID0gd2lkdGggLSAxMDtcclxuXHJcblx0XHRcdFx0XHRpZiAoYnJhbmNoKSB7XHJcblx0XHRcdFx0XHRcdHkgKz0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgxMCwgMjApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0eSArPSB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKDIwLCBkaXN0YW5jZSAvIHNlZ21lbnRzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICgoIWJyYW5jaCAmJiBpID09IHNlZ21lbnRzIC0gMSkgfHwgeSA+IGRpc3RhbmNlKSB7XHJcblx0XHRcdFx0XHRcdHkgPSBkaXN0YW5jZTtcclxuXHRcdFx0XHRcdFx0aWYgKCFicmFuY2gpIHggPSB3aWR0aCAvIDI7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyh4LCB5KTtcclxuXHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoeSA+PSBkaXN0YW5jZSkgYnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFicmFuY2gpIHtcclxuXHRcdFx0XHRcdFx0aWYgKFBoYXNlci5VdGlscy5jaGFuY2VSb2xsKDIwKSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlTGlnaHRuaW5nVGV4dHVyZSh4LCB5LCAxMCwgMSwgdHJ1ZSwgZGlzdGFuY2UpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmxpZ2h0bmluZ0JpdG1hcC5kaXJ0eSA9IHRydWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZUJnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgbXlCaXRtYXAgPSB0aGlzLmdhbWUuYWRkLmJpdG1hcERhdGEodGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcclxuXHRcdFx0XHR2YXIgZ3JkID0gbXlCaXRtYXAuY29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCB0aGlzLmdhbWUuaGVpZ2h0KTtcclxuXHRcdFx0XHRncmQuYWRkQ29sb3JTdG9wKDAsIFwiIzMzM1wiKTtcclxuXHRcdFx0XHRncmQuYWRkQ29sb3JTdG9wKDEsIFwiIzAwMFwiKTtcclxuXHRcdFx0XHRteUJpdG1hcC5jb250ZXh0LmZpbGxTdHlsZSA9IGdyZDtcclxuXHRcdFx0XHRteUJpdG1hcC5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCk7XHJcblxyXG5cdFx0XHRcdHJldHVybiBteUJpdG1hcDtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2NhbGVDbG91ZHM6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRcdFx0XHR0aGlzLmNsb3Vkcy5mb3JFYWNoKGZ1bmN0aW9uKGNsb3VkKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHdpZHRoID4gY2xvdWQuaW1nQ2FjaGUud2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0Y2xvdWQuc2NhbGUueCA9IHdpZHRoIC8gY2xvdWQuaW1nQ2FjaGUud2lkdGg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y2xvdWQuc2NhbGUueCA9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjbG91ZC5zY2FsZS55ID0gaGVpZ2h0IC8gY2xvdWQuaW1nQ2FjaGUuaGVpZ2h0O1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5kcmFnb24uYWRpdGlvbmFsSW5mby5yb2FyICYmXHJcblx0XHRcdFx0XHR0aGlzLmRyYWdvbi54ID4gdGhpcy5nYW1lLndvcmxkLmNlbnRlclggLSAxMDAgJiZcclxuXHRcdFx0XHRcdHRoaXMuZHJhZ29uLnggPCB0aGlzLmdhbWUud29ybGQuY2VudGVyWCArIDEwMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5kcmFnb24uYWRpdGlvbmFsSW5mby5yb2FyID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmRyYWdvblJvYXIucGxheSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZHJhZ29uLmFkaXRpb25hbEluZm8uZGlyZWN0aW9uID09ICdyaWdodCcpIHtcclxuXHRcdFx0XHRcdHRoaXMuZHJhZ29uLnggKz0gMztcclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy5kcmFnb24ueCA+IHRoaXMuZ2FtZS53aWR0aCArIDYwMCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYWdvbi5hZGl0aW9uYWxJbmZvLmRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRcdFx0dmFyIHJhbmRvbVNjYWxlID0gdGhpcy5nYW1lLnJuZC5yZWFsSW5SYW5nZSgwLjgsIDEuNCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZHJhZ29uLnNjYWxlLnNldFRvKC1yYW5kb21TY2FsZSwgcmFuZG9tU2NhbGUpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYWdvbi55ID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSh0aGlzLndvcmxkLmNlbnRlclkgLSB0aGlzLndvcmxkLmNlbnRlclkgLyAyLCB0aGlzLndvcmxkLmNlbnRlclkgKyB0aGlzLndvcmxkLmNlbnRlclkgLyAyKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5kcmFnb24uYWRpdGlvbmFsSW5mby5yb2FyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuZHJhZ29uLmFkaXRpb25hbEluZm8uZGlyZWN0aW9uID09ICdsZWZ0Jykge1xyXG5cdFx0XHRcdFx0dGhpcy5kcmFnb24ueCAtPSAzO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmRyYWdvbi54IDwgLTYwMCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYWdvbi5hZGl0aW9uYWxJbmZvLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0XHRcdHZhciByYW5kb21TY2FsZSA9IHRoaXMuZ2FtZS5ybmQucmVhbEluUmFuZ2UoMC44LCAxLjQpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYWdvbi5zY2FsZS5zZXRUbyhyYW5kb21TY2FsZSwgcmFuZG9tU2NhbGUpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYWdvbi55ID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSh0aGlzLndvcmxkLmNlbnRlclkgLSB0aGlzLndvcmxkLmNlbnRlclkgLyAyLCB0aGlzLndvcmxkLmNlbnRlclkgKyB0aGlzLndvcmxkLmNlbnRlclkgLyAyKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5kcmFnb24uYWRpdGlvbmFsSW5mby5yb2FyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFx0XHRcdHRoaXMuZ2FtZS53b3JsZC5zZXRCb3VuZHMoLTEwLCAtMTAsIHdpZHRoICsgMjAsIGhlaWdodCArIDIwKTtcclxuXHRcdFx0XHR0aGlzLmVtaXR0ZXIud2lkdGggPSB0aGlzLmZsYXNoLndpZHRoID0gd2lkdGg7XHJcblx0XHRcdFx0dGhpcy5lbWl0dGVyLnggPSB0aGlzLmVtaXR0ZXIud2lkdGggLyAyO1xyXG5cclxuXHRcdFx0XHR0aGlzLm1vb24ueCA9IHdpZHRoIC8gMjtcclxuXHJcblx0XHRcdFx0dGhpcy5iYWNrZ3JvdW5kLndpZHRoID0gd2lkdGg7XHJcblx0XHRcdFx0dGhpcy5iYWNrZ3JvdW5kLmhlaWdodCA9IGhlaWdodDtcclxuXHJcblx0XHRcdFx0dGhpcy5zY2FsZUNsb3Vkcyh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHN0YXRlO1xyXG5cdH1cclxufSkoUGhhc2VyKTsiLCIoZnVuY3Rpb24oUGhhc2VyKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcclxuICAgICAgICAuZmFjdG9yeSgnRmxhcHB5QmlyZFBsYXknLCBGbGFwcHlCaXJkUGxheSk7XHJcblxyXG4gICAgRmxhcHB5QmlyZFBsYXkuJGluamVjdCA9IFsnJGNvcmRvdmFWaWJyYXRpb24nLCAnJHRpbWVvdXQnXTtcclxuICAgIGZ1bmN0aW9uIEZsYXBweUJpcmRQbGF5KCRjb3Jkb3ZhVmlicmF0aW9uLCAkdGltZW91dCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciAkc2NvcGUgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM0MUM5RDZcIjtcclxuXHRcdFx0XHR0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcclxuXHRcdFx0XHR0aGlzLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFO1xyXG5cdFx0XHRcdHRoaXMuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuRVhBQ1RfRklUO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUudXBkYXRlTGF5b3V0KCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vUGl4ZWwgQXJ0XHJcblx0XHQgICAgICAgIHRoaXMuZ2FtZS5yZW5kZXJlci5yZW5kZXJTZXNzaW9uLnJvdW5kUGl4ZWxzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmRlc2lyZWRGcHMgPSA2MDtcclxuXHRcdFx0fSxcclxuICAgICAgICAgICAgcHJlbG9hZDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCd0dWJlJywgJ2Fzc2V0cy90dWJlLnBuZycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoJ2dyb3VuZCcsICdhc3NldHMvZ3JvdW5kLnBuZycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoJ2JpcmQnLCAnYXNzZXRzL2JpcmQucG5nJywgNzUsIDU1KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXVkaW8oJ2hpdCcsIFsnYXVkaW8vaGl0Lm9nZyddKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF1ZGlvKCdkaWUnLCBbJ2F1ZGlvL2RpZS5vZ2cnXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUubG9hZC5hdWRpbygncG9pbnQnLCBbJ2F1ZGlvL3BvaW50Lm9nZyddKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF1ZGlvKCd3aW5nJywgWydhdWRpby93aW5nLm9nZycsICdhdWRpby93aW5nLm1wMyddKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0RlYnVnZ2luZyA9ICRzY29wZS5pc0RlYnVnZ2luZztcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxTY29yZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5KdW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FuUmVzdGFydCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUud29ybGQuc2V0Qm91bmRzKC0xMCwgMCwgdGhpcy5nYW1lLndpZHRoICsgMTAsIHRoaXMuZ2FtZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5jaGVja0NvbGxpc2lvbi51cCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR1YmVzID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dWJlcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHViZXMuY3JlYXRlTXVsdGlwbGUoMTIsICd0dWJlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld3R1YmVzID0gdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmxvb3AoMTUwMCwgdGhpcy5uZXdUdWJlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3dHViZXMudGltZXIuc3RvcChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29ycyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29ycy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VuZENhY2hlID0gdGhpcy5nYW1lLmNhY2hlLmdldEZyYW1lKCdncm91bmQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC50aWxlU3ByaXRlKC0xMCwgdGhpcy5nYW1lLmhlaWdodCwgdGhpcy5nYW1lLndpZHRoICsgMjAsIGdyb3VuZENhY2hlLmhlaWdodCwgJ2dyb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmQuYW5jaG9yLnkgPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzLmdyb3VuZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZC5ib2R5LmltbW92YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZC5ib2R5Lm1vdmVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZC5hdXRvU2Nyb2xsKC01MCwgMCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuYmlyZCA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLzIsIHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZLCAnYmlyZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaXJkLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5zY2FsZS5zZXQoMC44KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5hbmltYXRpb25zLmFkZCgnZmx5JywgbnVsbCwgMTUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaXJkLmFuaW1hdGlvbnMucGxheSgnZmx5Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuRmx5ID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmJpcmQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50d2VlbkZseS50byh7IHk6IHRoaXMuYmlyZC55ICsgMjB9LCA0MDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluT3V0LCB0cnVlLCAwLCAtMSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5waXZvdC54ID0gLXRoaXMuYmlyZC53aWR0aC8yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaXJkLmV2ZW50cy5vbk91dE9mQm91bmRzLmFkZChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuSnVtcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpcmQuZXZlbnRzLm9uRW50ZXJCb3VuZHMuYWRkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5KdW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQub25Eb3duLmFkZCh0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZVRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQodGhpcy5nYW1lLndvcmxkLmNlbnRlclgsIHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZLzMsIFwiMFwiLCB7IGZvbnQ6IFwiNjBweCBBcmlhbFwiLCBmaWxsOiBcIiNmZmZmZmZcIiB9KTsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlVGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuaGl0QXVkaW8gPSB0aGlzLmFkZC5hdWRpbygnaGl0Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpZUF1ZGlvID0gdGhpcy5hZGQuYXVkaW8oJ2RpZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludEF1ZGlvID0gdGhpcy5hZGQuYXVkaW8oJ3BvaW50Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndpbmdBdWRpbyA9IHRoaXMuYWRkLmF1ZGlvKCd3aW5nJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmQuYXV0b1Njcm9sbCgwLCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHdlZW5GbHkuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzLmJpcmQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaXJkLmJvZHkuc2V0U2l6ZSh0aGlzLmJpcmQud2lkdGggLSAxMCwgdGhpcy5iaXJkLmhlaWdodCAtIDEwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5ib2R5LmdyYXZpdHkueSA9IDIwMDA7XHRcdFxyXG4gICAgICAgICAgICAgICAgdGhpcy5iaXJkLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXd0dWJlcy50aW1lci5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYW1lT3ZlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3dHViZXMudGltZXIuc3RvcChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5nYW1lLmNhbWVyYSkudG8oeyB4OiAtMTAgfSwgNDAsIFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5Jbk91dCwgdHJ1ZSwgMCwgNSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpcmQuYW5pbWF0aW9ucy5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxhc2ggPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKC0xMCwgMCk7XHJcblx0XHRcdFx0dGhpcy5mbGFzaC5iZWdpbkZpbGwoMHhmZmZmZmYsIDEpO1xyXG5cdFx0XHRcdHRoaXMuZmxhc2guZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoICsgMjAsIHRoaXMuZ2FtZS5oZWlnaHQpO1xyXG5cdFx0XHRcdHRoaXMuZmxhc2guZW5kRmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbGFzaC5hbHBoYSA9IDAuNTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5mbGFzaCkudG8oeyBhbHBoYTogMCB9LCA1MCwgUGhhc2VyLkVhc2luZy5DdWJpYy5JbiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVhZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNhblJlc3RhcnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSwgUGhhc2VyLlRpbWVyLlNFQ09ORCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudHViZXMuZm9yRWFjaEFsaXZlKGZ1bmN0aW9uKHR1YmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHR1YmUuYm9keS52ZWxvY2l0eS54ID0gMDtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zb3JzLmZvckVhY2hBbGl2ZShmdW5jdGlvbihzZW5zb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbnNvci5ib2R5LnZlbG9jaXR5LnggPSAwO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFWaWJyYXRpb24udmlicmF0ZSgzMDApO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuaGl0QXVkaW8ucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGllQXVkaW8ucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAganVtcDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmRlYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmRlYWQgJiYgdGhpcy5jYW5KdW1wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaXJkLmFuaW1hdGlvbnMucGxheSgnZmx5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaXJkSW5KdW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpcmQuYm9keS52ZWxvY2l0eS55ID0gLTU1MDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmdBdWRpby5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZGVhZCAmJiB0aGlzLmNhblJlc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQodGhpcy5nYW1lLnN0YXRlLmN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLmJpcmQsIHRoaXMuZ3JvdW5kKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuc3RhcnRlZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFuZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZGVhZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLmJpcmQsIHRoaXMudHViZXMsIHRoaXMuZ2FtZU92ZXIsIG51bGwsIHRoaXMpOyBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHRoaXMuYmlyZCwgdGhpcy5zZW5zb3JzLCB0aGlzLmluY3JlbWVudFNjb3JlLCBudWxsLCB0aGlzKTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kLnRpbGVQb3NpdGlvbi54IC09IDI7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmlyZC5ib2R5LnRvdWNoaW5nLmRvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlQW5nbGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYmlyZC5ib2R5LnRvdWNoaW5nLmRvd24pIHJldHVybjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5iaXJkSW5KdW1wKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJpcmQuYW5nbGUgPiAtMzApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJpcmQuYW5nbGUgLT0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmlyZEluSnVtcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMuYmlyZC5hbmdsZSA8IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5hbmdsZSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5iaXJkLmFuZ2xlIDwgNDUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmlyZC5hbmltYXRpb25zLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpcmQuYW5nbGUgKz0gMjtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMuYmlyZC5hbmdsZSA8IDkwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpcmQuYW5nbGUgKz0gNDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzaXplOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJpcmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmlyZC54ID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclgvMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2NvcmVUZXh0KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3JlVGV4dC55ID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclkvMztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3JlVGV4dC54ID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZC53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aCArIDIwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5pc0RlYnVnZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcudGV4dCgnRGVidWdnaW5nJywgMTAsIDMwLCAnd2hpdGUnLCAnMjBweCBcIlNpZ21hciBPbmVcIicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmRlYnVnLmJvZHkodGhpcy5iaXJkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KHRoaXMuZ3JvdW5kLCAncmdiYSgyNTUsIDI1NSwgMCwgMC41KScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmRlYnVnLmdlb20obmV3IFBoYXNlci5Qb2ludCh0aGlzLmJpcmQueCwgdGhpcy5iaXJkLnkpLCAnI0ZGRkYwMCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dWJlcyAmJiB0aGlzLnR1YmVzLmZvckVhY2hBbGl2ZShmdW5jdGlvbih0dWJlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keSh0dWJlLCAncmdiYSgwLCAwLCAyNTUsIDAuNSknKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpOyBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29ycyAmJiB0aGlzLnNlbnNvcnMuZm9yRWFjaEFsaXZlKGZ1bmN0aW9uKHNlbnNvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLmRlYnVnLmJvZHkoc2Vuc29yLCAncmdiYSgwLCAyNTUsIDAsIDAuNSknKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuZXdUdWJlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbVBvc2l0aW9uID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgxMjAsIHRoaXMuZ2FtZS5oZWlnaHQgLSB0aGlzLmdyb3VuZC5oZWlnaHQgLSAxMDApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgdHViZSA9IHRoaXMuZ2FtZS5jYWNoZS5nZXRGcmFtZSgndHViZScpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgdHViZTEgPSB0aGlzLnR1YmVzLmdldEZpcnN0RGVhZCgpO1xyXG4gICAgICAgICAgICAgICAgdHViZTEucmVzZXQodGhpcy5nYW1lLndpZHRoICsgdHViZS53aWR0aC8yLCByYW5kb21Qb3NpdGlvbiAtIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB0dWJlMS5hbmNob3Iuc2V0VG8oMC41LCAxKTtcclxuICAgICAgICAgICAgICAgIHR1YmUxLnNjYWxlLnNldCgxLjQpO1xyXG4gICAgICAgICAgICAgICAgdHViZTEuYm9keS52ZWxvY2l0eS54ID0gLTE4MDtcclxuICAgICAgICAgICAgICAgIHR1YmUxLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHR1YmUxLmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdHViZTEub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIHR1YmUyID0gdGhpcy50dWJlcy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICAgICAgICAgIHR1YmUyLnJlc2V0KHRoaXMuZ2FtZS53aWR0aCArIHR1YmUud2lkdGgvMiwgcmFuZG9tUG9zaXRpb24gKyAxMDAgKyB0dWJlLmhlaWdodC8yKTtcclxuICAgICAgICAgICAgICAgIHR1YmUyLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgICAgICB0dWJlMi5zY2FsZS5zZXRUbygtMS40LCAtMS40KTtcclxuICAgICAgICAgICAgICAgIHR1YmUyLmJvZHkudmVsb2NpdHkueCA9IC0xODA7XHJcbiAgICAgICAgICAgICAgICB0dWJlMi5ib2R5LmltbW92YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0dWJlMi5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHR1YmUyLm91dE9mQm91bmRzS2lsbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBzZW5zb3IgPSB0aGlzLnNlbnNvcnMuY3JlYXRlKHRoaXMuZ2FtZS53aWR0aCArIHR1YmUud2lkdGgsIDApO1xyXG4gICAgICAgICAgICAgICAgc2Vuc29yLmJvZHkuc2V0U2l6ZSg0MCwgdGhpcy5nYW1lLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBzZW5zb3IuYm9keS52ZWxvY2l0eS54ID0gLTE4MDtcclxuICAgICAgICAgICAgICAgIHNlbnNvci5ib2R5LmltbW92YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZW5zb3IuYWxwaGEgPSAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbmNyZW1lbnRTY29yZTogZnVuY3Rpb24oYmlyZCwgc2Vuc29yKXtcclxuICAgICAgICAgICAgICAgIHNlbnNvci5raWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsU2NvcmUrKztcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmVUZXh0LnNldFRleHQodGhpcy50b3RhbFNjb3JlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRBdWRpby5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvZ2dsZURlYnVnOiBmdW5jdGlvbiAoaXNEZWJ1Z2dpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0RlYnVnZ2luZyA9IGlzRGVidWdnaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRTdGF0ZTogZnVuY3Rpb24gKHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUgPSBzY29wZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pKFBoYXNlcik7IiwiKGZ1bmN0aW9uKFBoYXNlcikge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnUGhvdG9QbGF5JywgUGhvdG9QbGF5KTtcclxuXHJcblx0UGhvdG9QbGF5LiRpbmplY3QgPSBbJyRpb25pY0xvYWRpbmcnLCAnJGNvcmRvdmFTcGlubmVyRGlhbG9nJ107XHJcblx0ZnVuY3Rpb24gUGhvdG9QbGF5KCRpb25pY0xvYWRpbmcsICRjb3Jkb3ZhU3Bpbm5lckRpYWxvZykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciAkc2NvcGUgPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgZ2V0RmxvYXQzMkFycmF5ID0gZnVuY3Rpb24gKGxlbikge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBGbG9hdDMyQXJyYXkgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkgPSBsZW4uc2xpY2UoMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IEFycmF5KGxlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkobGVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfTtcclxuXHRcdFxyXG5cdFx0dmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5SRVNJWkU7XHJcblx0XHRcdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKCdwaG90bycsICRzY29wZS5pbWFnZURhdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm1kID0gdGhpcy5nYW1lLm1ha2UuYml0bWFwRGF0YSh0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibWQubG9hZCgncGhvdG8nKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5waG90byA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLCB0aGlzLmdhbWUud29ybGQuY2VudGVyWSwgdGhpcy5ibWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waG90by5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxGaWx0ZXJzID0gOTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0SW1hZ2U6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgICAgICAgICAgfSxcclxuXHRcdFx0cmVzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGhvdG8pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGhvdG8ueCA9IHdpZHRoLzI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waG90by55ID0gaGVpZ2h0LzI7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBob3RvQ2FjaGUgPSB0aGlzLmdhbWUuY2FjaGUuZ2V0RnJhbWUoJ3Bob3RvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocGhvdG9DYWNoZS53aWR0aCA+IHRoaXMucGhvdG8ud2lkdGgpIHRoaXMuc2NhbGVXaWR0aChwaG90b0NhY2hlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihwaG90b0NhY2hlLmhlaWdodCA+IHRoaXMucGhvdG8uaGVpZ2h0KSB0aGlzLnNjYWxlSGVpZ2h0KHBob3RvQ2FjaGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnBob3RvLndpZHRoID4gdGhpcy5nYW1lLndpZHRoKSB0aGlzLnNjYWxlV2lkdGgodGhpcy5nYW1lLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnBob3RvLmhlaWdodCA+IHRoaXMuZ2FtZS5oZWlnaHQpIHRoaXMuc2NhbGVIZWlnaHQodGhpcy5nYW1lLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdH0sXHJcbiAgICAgICAgICAgIHNjYWxlV2lkdGggOiBmdW5jdGlvbiAod2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IHdpZHRoIC8gdGhpcy5waG90by53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMucGhvdG8ud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMucGhvdG8uaGVpZ2h0ICo9IHNjYWxlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2FsZUhlaWdodDogZnVuY3Rpb24gKGhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gaGVpZ2h0IC8gdGhpcy5waG90by5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBob3RvLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgICAgIHRoaXMucGhvdG8ud2lkdGggKj0gc2NhbGU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlbGVjdEZpbHRlcjogZnVuY3Rpb24gKGltYWdlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJtZC5jdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBpbWFnZURhdGE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvYWRQaG90bzogZnVuY3Rpb24gKGltYWdlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGRhdGEgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIC8vIGRhdGEuc3JjID0gaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5nYW1lLmNhY2hlLmFkZEltYWdlKCdwaG90bycsIGltYWdlRGF0YSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnBob3RvTG9hZGVkKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vT3RoZXIgZXhhbXBsZSB0byBsb2FkIGJhc2U2NCBzdHJpbmcgd2l0aCBQaGFzZXJcclxuICAgICAgICAgICAgICAgIHZhciBsb2FkZXIgPSBuZXcgUGhhc2VyLkxvYWRlcih0aGlzLmdhbWUpO1xyXG4gICAgICAgICAgICAgICAgbG9hZGVyLmltYWdlKCdwaG90bycsIGltYWdlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXIub25Mb2FkQ29tcGxldGUuYWRkT25jZSh0aGlzLnBob3RvTG9hZGVkLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIGxvYWRlci5zdGFydCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwaG90b0xvYWRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBob3RvQ2FjaGUgPSB0aGlzLmdhbWUuY2FjaGUuZ2V0RnJhbWUoJ3Bob3RvJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJtZC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibWQucmVzaXplKHBob3RvQ2FjaGUud2lkdGgsIHBob3RvQ2FjaGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm1kLmxvYWQoJ3Bob3RvJyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuYm1kRmlsdGVyID0gdGhpcy5nYW1lLm1ha2UuYml0bWFwRGF0YShwaG90b0NhY2hlLndpZHRoLCBwaG90b0NhY2hlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEZpbHRlcnMoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZEZpbHRlcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnRvdGFsRmlsdGVyczsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm1kRmlsdGVyLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibWRGaWx0ZXIuY3R4LnB1dEltYWdlRGF0YSh0aGlzLmxvYWRGaWx0ZXIoaW5kZXgpLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZURhdGE6IHRoaXMuYm1kRmlsdGVyLmNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucGhvdG9Ub29sLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9IaWRlIGxvYWRpbmdcclxuICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICAkY29yZG92YVNwaW5uZXJEaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2goZXJyKXtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9hZEZpbHRlcjogZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0O1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5ibWQuaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMubHVtaW5hbmNlKHRoaXMuYm1kLmltYWdlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy50aHJlc2hvbGQodGhpcy5ibWQuaW1hZ2VEYXRhLCAxMjgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuaW52ZXJ0KHRoaXMuYm1kLmltYWdlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5icmlnaHRuZXNzQ29udHJhc3QodGhpcy5ibWQuaW1hZ2VEYXRhLCAtMC4yNSwgMS41KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbHV0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogdGhpcy5pZGVudGl0eUxVVCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZzogdGhpcy5jcmVhdGVMVVRGcm9tQ3VydmUoW1swLCAwXSwgWzEwLCAwXSwgWzEyOCwgNThdLCBbMjAwLCAyMjJdLCBbMjI1LCAyNTVdXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiB0aGlzLmlkZW50aXR5TFVUKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhOiB0aGlzLmlkZW50aXR5TFVUKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5hcHBseUxVVCh0aGlzLmJtZC5pbWFnZURhdGEsIGx1dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5nYXVzc2lhbkJsdXIodGhpcy5ibWQuaW1hZ2VEYXRhLCA4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmdyYXlzY2FsZSh0aGlzLmJtZC5pbWFnZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMubGFwbGFjZSh0aGlzLmJtZC5pbWFnZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsdW1pbmFuY2U6IGZ1bmN0aW9uIChwaXhlbHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLmJtZEZpbHRlci5pbWFnZURhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gb3V0cHV0LmRhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHBpeGVscy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSBkW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBnID0gZFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSBkW2kgKyAyXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDSUUgbHVtaW5hbmNlIGZvciB0aGUgUkdCXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSAwLjIxMjYgKiByICsgMC43MTUyICogZyArIDAuMDcyMiAqIGI7XHJcbiAgICAgICAgICAgICAgICAgICAgZHN0W2ldID0gZHN0W2kgKyAxXSA9IGRzdFtpICsgMl0gPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdFtpICsgM10gPSBkW2kgKyAzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRocmVzaG9sZDogZnVuY3Rpb24gKHBpeGVscywgdGhyZXNob2xkLCBoaWdoLCBsb3cpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLmJtZEZpbHRlci5pbWFnZURhdGE7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGlnaCA9PSBudWxsKSBoaWdoID0gMjU1O1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvdyA9PSBudWxsKSBsb3cgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBwaXhlbHMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSBvdXRwdXQuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZC5sZW5ndGg7IGkgKz0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByID0gZFtpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZyA9IGRbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gZFtpICsgMl07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSAoMC4zICogciArIDAuNTkgKiBnICsgMC4xMSAqIGIgPj0gdGhyZXNob2xkKSA/IGhpZ2ggOiBsb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgZHN0W2ldID0gZHN0W2kgKyAxXSA9IGRzdFtpICsgMl0gPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdFtpICsgM10gPSBkW2kgKyAzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGludmVydDogZnVuY3Rpb24gKHBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuYm1kRmlsdGVyLmltYWdlRGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gcGl4ZWxzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHN0ID0gb3V0cHV0LmRhdGE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGQubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkc3RbaV0gPSAyNTUgLSBkW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdFtpICsgMV0gPSAyNTUgLSBkW2kgKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICBkc3RbaSArIDJdID0gMjU1IC0gZFtpICsgMl07XHJcbiAgICAgICAgICAgICAgICAgICAgZHN0W2kgKyAzXSA9IGRbaSArIDNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYnJpZ2h0bmVzc0NvbnRyYXN0OiBmdW5jdGlvbiAocGl4ZWxzLCBicmlnaHRuZXNzLCBjb250cmFzdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGx1dCA9IHRoaXMuYnJpZ2h0bmVzc0NvbnRyYXN0TFVUKGJyaWdodG5lc3MsIGNvbnRyYXN0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcGx5TFVUKHBpeGVscywgeyByOiBsdXQsIGc6IGx1dCwgYjogbHV0LCBhOiB0aGlzLmlkZW50aXR5TFVUKCkgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlkZW50aXR5TFVUOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbHV0ID0gdGhpcy5nZXRVaW50OEFycmF5KDI1Nik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGx1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGx1dFtpXSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbHV0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhcHBseUxVVDogZnVuY3Rpb24gKHBpeGVscywgbHV0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5ibWRGaWx0ZXIuaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBwaXhlbHMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSBvdXRwdXQuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciByID0gbHV0LnI7XHJcbiAgICAgICAgICAgICAgICB2YXIgZyA9IGx1dC5nO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSBsdXQuYjtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gbHV0LmE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGQubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkc3RbaV0gPSByW2RbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdFtpICsgMV0gPSBnW2RbaSArIDFdXTtcclxuICAgICAgICAgICAgICAgICAgICBkc3RbaSArIDJdID0gYltkW2kgKyAyXV07XHJcbiAgICAgICAgICAgICAgICAgICAgZHN0W2kgKyAzXSA9IGFbZFtpICsgM11dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYnJpZ2h0bmVzc0NvbnRyYXN0TFVUOiBmdW5jdGlvbiAoYnJpZ2h0bmVzcywgY29udHJhc3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsdXQgPSB0aGlzLmdldFVpbnQ4QXJyYXkoMjU2KTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250cmFzdEFkanVzdCA9IC0xMjggKiBjb250cmFzdCArIDEyODtcclxuICAgICAgICAgICAgICAgIHZhciBicmlnaHRuZXNzQWRqdXN0ID0gMjU1ICogYnJpZ2h0bmVzcztcclxuICAgICAgICAgICAgICAgIHZhciBhZGp1c3QgPSBjb250cmFzdEFkanVzdCArIGJyaWdodG5lc3NBZGp1c3Q7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGx1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gaSAqIGNvbnRyYXN0ICsgYWRqdXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIGx1dFtpXSA9IGMgPCAwID8gMCA6IChjID4gMjU1ID8gMjU1IDogYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbHV0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRVaW50OEFycmF5OiBmdW5jdGlvbiAobGVuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVWludDhBcnJheSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbGVuLnNsaWNlKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5ID0gbmV3IEFycmF5KGxlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGxlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNyZWF0ZUxVVEZyb21DdXJ2ZTogZnVuY3Rpb24gKHBvaW50cykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGx1dCA9IHRoaXMuZ2V0VWludDhBcnJheSgyNTYpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBbMCwgMF07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCBsdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IHBvaW50cy5sZW5ndGggJiYgcG9pbnRzW2pdWzBdIDwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwID0gcG9pbnRzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGx1dFtpXSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbHV0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpZGVudGl0eTogZnVuY3Rpb24gKHBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuYm1kRmlsdGVyLmltYWdlRGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSBvdXRwdXQuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gcGl4ZWxzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkc3RbaV0gPSBkW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmVydGljYWxDb252b2x2ZUZsb2F0MzI6IGZ1bmN0aW9uIChwaXhlbHMsIHdlaWdodHNWZWN0b3IsIG9wYXF1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNpZGUgPSB3ZWlnaHRzVmVjdG9yLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBoYWxmU2lkZSA9IE1hdGguZmxvb3Ioc2lkZSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSBwaXhlbHMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBzdyA9IHBpeGVscy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHZhciBzaCA9IHBpeGVscy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHcgPSBzdztcclxuICAgICAgICAgICAgICAgIHZhciBoID0gc2g7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5ibWRGaWx0ZXIuaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IG91dHB1dC5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhbHBoYUZhYyA9IG9wYXF1ZSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgaDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3OyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN5ID0geTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN4ID0geDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRzdE9mZiA9ICh5ICogdyArIHgpICogNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSAwLCBnID0gMCwgYiA9IDAsIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjeSA9IDA7IGN5IDwgc2lkZTsgY3krKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjeSA9IE1hdGgubWluKHNoIC0gMSwgTWF0aC5tYXgoMCwgc3kgKyBjeSAtIGhhbGZTaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2N4ID0gc3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3JjT2ZmID0gKHNjeSAqIHN3ICsgc2N4KSAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd3QgPSB3ZWlnaHRzVmVjdG9yW2N5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgKz0gc3JjW3NyY09mZl0gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcgKz0gc3JjW3NyY09mZiArIDFdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiICs9IHNyY1tzcmNPZmYgKyAyXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSArPSBzcmNbc3JjT2ZmICsgM10gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkc3RbZHN0T2ZmXSA9IHI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmYgKyAxXSA9IGc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmYgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmYgKyAzXSA9IGEgKyBhbHBoYUZhYyAqICgyNTUgLSBhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBob3Jpem9udGFsQ29udm9sdmU6IGZ1bmN0aW9uIChwaXhlbHMsIHdlaWdodHNWZWN0b3IsIG9wYXF1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNpZGUgPSB3ZWlnaHRzVmVjdG9yLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBoYWxmU2lkZSA9IE1hdGguZmxvb3Ioc2lkZSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSBwaXhlbHMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBzdyA9IHBpeGVscy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHZhciBzaCA9IHBpeGVscy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHcgPSBzdztcclxuICAgICAgICAgICAgICAgIHZhciBoID0gc2g7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5ibWRGaWx0ZXIuaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IG91dHB1dC5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhbHBoYUZhYyA9IG9wYXF1ZSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgaDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3OyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN5ID0geTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN4ID0geDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRzdE9mZiA9ICh5ICogdyArIHgpICogNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSAwLCBnID0gMCwgYiA9IDAsIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjeCA9IDA7IGN4IDwgc2lkZTsgY3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjeSA9IHN5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjeCA9IE1hdGgubWluKHN3IC0gMSwgTWF0aC5tYXgoMCwgc3ggKyBjeCAtIGhhbGZTaWRlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3JjT2ZmID0gKHNjeSAqIHN3ICsgc2N4KSAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd3QgPSB3ZWlnaHRzVmVjdG9yW2N4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgKz0gc3JjW3NyY09mZl0gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcgKz0gc3JjW3NyY09mZiArIDFdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiICs9IHNyY1tzcmNPZmYgKyAyXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSArPSBzcmNbc3JjT2ZmICsgM10gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkc3RbZHN0T2ZmXSA9IHI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmYgKyAxXSA9IGc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmYgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmYgKyAzXSA9IGEgKyBhbHBoYUZhYyAqICgyNTUgLSBhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXBhcmFibGVDb252b2x2ZTogZnVuY3Rpb24gKHBpeGVscywgaG9yaXpXZWlnaHRzLCB2ZXJ0V2VpZ2h0cywgb3BhcXVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ob3Jpem9udGFsQ29udm9sdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbENvbnZvbHZlRmxvYXQzMihwaXhlbHMsIHZlcnRXZWlnaHRzLCBvcGFxdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGhvcml6V2VpZ2h0cywgb3BhcXVlXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnYXVzc2lhbkJsdXI6IGZ1bmN0aW9uIChwaXhlbHMsIGRpYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBkaWFtZXRlciA9IE1hdGguYWJzKGRpYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaWFtZXRlciA8PSAxKSByZXR1cm4gdGhpcy5pZGVudGl0eShwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhZGl1cyA9IGRpYW1ldGVyIC8gMjtcclxuICAgICAgICAgICAgICAgIHZhciBsZW4gPSBNYXRoLmNlaWwoZGlhbWV0ZXIpICsgKDEgLSAoTWF0aC5jZWlsKGRpYW1ldGVyKSAlIDIpKVxyXG4gICAgICAgICAgICAgICAgdmFyIHdlaWdodHMgPSBnZXRGbG9hdDMyQXJyYXkobGVuKTtcclxuICAgICAgICAgICAgICAgIHZhciByaG8gPSAocmFkaXVzICsgMC41KSAvIDM7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmhvU3EgPSByaG8gKiByaG87XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2F1c3NpYW5GYWN0b3IgPSAxIC8gTWF0aC5zcXJ0KDIgKiBNYXRoLlBJICogcmhvU3EpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJob0ZhY3RvciA9IC0xIC8gKDIgKiByaG8gKiByaG8pXHJcbiAgICAgICAgICAgICAgICB2YXIgd3N1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWlkZGxlID0gTWF0aC5mbG9vcihsZW4gLyAyKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IGkgLSBtaWRkbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGd4ID0gZ2F1c3NpYW5GYWN0b3IgKiBNYXRoLmV4cCh4ICogeCAqIHJob0ZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0c1tpXSA9IGd4O1xyXG4gICAgICAgICAgICAgICAgICAgIHdzdW0gKz0gZ3g7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdlaWdodHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRzW2ldIC89IHdzdW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5zZXBhcmFibGVDb252b2x2ZShwaXhlbHMsIHdlaWdodHMsIHdlaWdodHMsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyYXlzY2FsZTogZnVuY3Rpb24gKHBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuYm1kRmlsdGVyLmltYWdlRGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkc3QgPSBvdXRwdXQuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gcGl4ZWxzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGQubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgciA9IGRbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGcgPSBkW2kgKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IGRbaSArIDJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gMC4zICogciArIDAuNTkgKiBnICsgMC4xMSAqIGI7XHJcbiAgICAgICAgICAgICAgICAgICAgZHN0W2ldID0gZHN0W2kgKyAxXSA9IGRzdFtpICsgMl0gPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdFtpICsgM10gPSBkW2kgKyAzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhcGxhY2VLZXJuZWw6IGdldEZsb2F0MzJBcnJheShbLTEsIC0xLCAtMSwgLTEsIDgsIC0xLCAtMSwgLTEsIC0xXSksXHJcbiAgICAgICAgICAgIGNvbnZvbHZlOiBmdW5jdGlvbiAocGl4ZWxzLCB3ZWlnaHRzLCBvcGFxdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaWRlID0gTWF0aC5yb3VuZChNYXRoLnNxcnQod2VpZ2h0cy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgIHZhciBoYWxmU2lkZSA9IE1hdGguZmxvb3Ioc2lkZSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzcmMgPSBwaXhlbHMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciBzdyA9IHBpeGVscy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHZhciBzaCA9IHBpeGVscy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHcgPSBzdztcclxuICAgICAgICAgICAgICAgIHZhciBoID0gc2g7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5ibWRGaWx0ZXIuaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRzdCA9IG91dHB1dC5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhbHBoYUZhYyA9IG9wYXF1ZSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgaDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3OyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN5ID0geTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN4ID0geDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRzdE9mZiA9ICh5ICogdyArIHgpICogNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSAwLCBnID0gMCwgYiA9IDAsIGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjeSA9IDA7IGN5IDwgc2lkZTsgY3krKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgY3ggPSAwOyBjeCA8IHNpZGU7IGN4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2N5ID0gTWF0aC5taW4oc2ggLSAxLCBNYXRoLm1heCgwLCBzeSArIGN5IC0gaGFsZlNpZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2N4ID0gTWF0aC5taW4oc3cgLSAxLCBNYXRoLm1heCgwLCBzeCArIGN4IC0gaGFsZlNpZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3JjT2ZmID0gKHNjeSAqIHN3ICsgc2N4KSAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHd0ID0gd2VpZ2h0c1tjeSAqIHNpZGUgKyBjeF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciArPSBzcmNbc3JjT2ZmXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcgKz0gc3JjW3NyY09mZiArIDFdICogd3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiArPSBzcmNbc3JjT2ZmICsgMl0gKiB3dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhICs9IHNyY1tzcmNPZmYgKyAzXSAqIHd0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRzdFtkc3RPZmZdID0gcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHN0W2RzdE9mZiArIDFdID0gZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHN0W2RzdE9mZiArIDJdID0gYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHN0W2RzdE9mZiArIDNdID0gYSArIGFscGhhRmFjICogKDI1NSAtIGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhcGxhY2U6IGZ1bmN0aW9uIChwaXhlbHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZvbHZlKHBpeGVscywgdGhpcy5sYXBsYWNlS2VybmVsLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblx0XHRcclxuXHRcdHJldHVybiB7XHJcbiAgICAgICAgICAgIGdldFN0YXRlOiBmdW5jdGlvbiAoc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZSA9IHNjb3BlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHR9XHJcbn0pKFBoYXNlcik7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5mYWN0b3J5KCdTaWduYXR1cmVQbGF5JywgU2lnbmF0dXJlUGxheSk7XHJcblxyXG5cdC8vU2lnbmF0dXJlUGxheS4kaW5qZWN0ID0gW107XHJcblx0ZnVuY3Rpb24gU2lnbmF0dXJlUGxheSgpIHtcclxuXHJcblx0XHR2YXIgc3RhdGUgPSB7XHJcblx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gMHhmZmZmZmY7XHJcblx0XHRcdFx0Ly90aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcclxuXHRcdFx0XHR0aGlzLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcclxuXHRcdFx0XHQvL3RoaXMuZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHRcdFx0Ly90aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5SRVNJWkU7XHJcblx0XHRcdFx0dGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuRVhBQ1RfRklUO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL0VOQUJMRSBERUJVRyBGUFNcclxuXHRcdFx0XHR0aGlzLmdhbWUudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5nYW1lLnRpbWUuZGVzaXJlZEZwcyA9IDEyMDtcclxuXHJcblx0XHRcdFx0Ly9FbGltaW5hdGUgdGhlIGRlbHRhIHRpbWVyIGluc2lkZSBQaGFzZXJcclxuXHRcdFx0XHR0aGlzLmdhbWUuZm9yY2VTaW5nbGVVcGRhdGUgPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRwcmVsb2FkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lvbnBoYXNlcicsICdyZXMvc2lnbmF0dXJlL2Fzc2V0cy9pb25waGFzZXIucG5nJyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5sYXllcnMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZCA9IHRoaXMuZ2FtZS5hZGQuYml0bWFwRGF0YSh0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xyXG5cdFx0XHRcdHRoaXMubGF5ZXJzLmFkZCh0aGlzLmJtZC5hZGRUb1dvcmxkKCkpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRPcHRpb24gPSAwO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lV2lkdGggPSA1O1xyXG5cdFx0XHRcdHRoaXMucG9pbnRzID0gW107XHJcblx0XHRcdFx0dGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0dGhpcy5nYW1lLmlucHV0Lm9uRG93bi5hZGQodGhpcy5zdGFydFRvdWNoLCB0aGlzKTtcclxuXHRcdFx0XHR0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKHRoaXMudG91Y2hNb3ZlLCB0aGlzKVxyXG5cdFx0XHRcdHRoaXMuZ2FtZS5pbnB1dC5vblVwLmFkZCh0aGlzLmVuZFRvdWNoLCB0aGlzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc0RyYXdpbmcpIHtcclxuXHJcblx0XHRcdFx0XHRzd2l0Y2ggKHRoaXMuY3VycmVudE9wdGlvbikge1xyXG5cdFx0XHRcdFx0XHRjYXNlIDEwOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZWxldmVudGhPcHRpb25Nb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR0b3VjaE1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzRHJhd2luZykge1xyXG5cclxuXHRcdFx0XHRcdHN3aXRjaCAodGhpcy5jdXJyZW50T3B0aW9uKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZmlyc3RPcHRpb25Nb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRoaXJkT3B0aW9uTW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5mb3VydGhPcHRpb25Nb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmZpZnRoT3B0aW9uTW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zaXh0aE9wdGlvbk1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V2ZW50aE9wdGlvbk1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSA3OlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZWlndGhPcHRpb25Nb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgODpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm5pbnRoT3B0aW9uTW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDk6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50ZW50aE9wdGlvbk1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAxMTpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnR3ZWxmdGhPcHRpb25Nb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMTI6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aGlydGVlbnRoT3B0aW9uTW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDEzOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZm91cnRlZW50aE9wdGlvbk1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAxNDpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmZpZnRlZW50aE9wdGlvbk1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR0aGlzLmJtZC5kaXJ0eSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdGFydFRvdWNoOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmxhc3RQb2ludCA9IHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuZ2FtZS5pbnB1dC54LFxyXG5cdFx0XHRcdFx0eTogdGhpcy5nYW1lLmlucHV0LnksXHJcblx0XHRcdFx0XHRuZXdMaW5lOiB0cnVlXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0dGhpcy5wb2ludHMucHVzaCh0aGlzLmxhc3RQb2ludCk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmJlZ2luUGF0aCgpO1xyXG5cclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuY3VycmVudE9wdGlvbikge1xyXG5cdFx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0XHR0aGlzLmZpcnN0T3B0aW9uRG93bigpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0dGhpcy5zZWNvbmRPcHRpb25Eb3duKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHR0aGlzLnRoaXJkT3B0aW9uRG93bigpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdFx0dGhpcy5mb3VydGhPcHRpb25Eb3duKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHR0aGlzLmZpZnRoT3B0aW9uRG93bigpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgODpcclxuXHRcdFx0XHRcdFx0dGhpcy5uaW50aE9wdGlvbkRvd24oKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDk6XHJcblx0XHRcdFx0XHRcdHRoaXMudGVudGhPcHRpb25Eb3duKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAxMDpcclxuXHRcdFx0XHRcdFx0dGhpcy5lbGV2ZW50aE9wdGlvbkRvd24oKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDEzOlxyXG5cdFx0XHRcdFx0XHR0aGlzLmZvdXJ0ZWVudGhPcHRpb25Eb3duKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8odGhpcy5sYXN0UG9pbnQueCwgdGhpcy5sYXN0UG9pbnQueSk7XHJcblx0XHRcdFx0dGhpcy5pc0RyYXdpbmcgPSB0cnVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlbmRUb3VjaDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2xlYXJDYW52YXM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMucG9pbnRzID0gW107XHJcblx0XHRcdFx0dGhpcy5sYXllcnMucmVtb3ZlQWxsKHRydWUpO1xyXG5cdFx0XHRcdHRoaXMubmV3TGF5ZXIoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0SW1hZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmdhbWUuY2FudmFzLnRvRGF0YVVSTCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjaGFuZ2VPcHRpb246IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50T3B0aW9uID0gcG9zaXRpb247XHJcblxyXG5cdFx0XHRcdHRoaXMubmV3TGF5ZXIoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y2hhbmdlTGluZVdpZHRoOiBmdW5jdGlvbih3aWR0aCkge1xyXG5cdFx0XHRcdHRoaXMubmV3TGF5ZXIoKTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVdpZHRoID0gd2lkdGg7XHJcblx0XHRcdH0sXHJcblx0XHRcdGZpcnN0T3B0aW9uRG93bjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVKb2luID0gdGhpcy5ibWQuY3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRmaXJzdE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lVG8odGhpcy5nYW1lLmlucHV0LngsIHRoaXMuZ2FtZS5pbnB1dC55KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNlY29uZE9wdGlvbkRvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lSm9pbiA9IHRoaXMuYm1kLmN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc2hhZG93Qmx1ciA9IHRoaXMuYm1kLmN0eC5saW5lV2lkdGggKyAzO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5zaGFkb3dDb2xvciA9ICdyZ2IoMCwgMCwgMCknO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aGlyZE9wdGlvbkRvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lSm9pbiA9IHRoaXMuYm1kLmN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc2hhZG93Qmx1ciA9IHRoaXMuYm1kLmN0eC5saW5lV2lkdGg7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LnNoYWRvd0NvbG9yID0gJ3JnYigwLCAwLCAwKSc7XHJcblx0XHRcdH0sXHJcblx0XHRcdHRoaXJkT3B0aW9uTW92ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmJtZC53aWR0aCwgdGhpcy5ibWQuaGVpZ2h0KTtcclxuXHRcdFx0XHR0aGlzLnBvaW50cy5wdXNoKHsgeDogdGhpcy5nYW1lLmlucHV0LngsIHk6IHRoaXMuZ2FtZS5pbnB1dC55IH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lm1vdmVUbyh0aGlzLnBvaW50c1swXS54LCB0aGlzLnBvaW50c1swXS55KTtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgcG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcclxuXHRcdFx0XHRcdGlmIChwb2ludC5uZXdMaW5lKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8ocG9pbnQueCwgcG9pbnQueSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVRvKHBvaW50LngsIHBvaW50LnkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGZvdXJ0aE9wdGlvbkRvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lSm9pbiA9IHRoaXMuYm1kLmN0eC5saW5lQ2FwID0gJ2J1dHQnO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRmb3VydGhPcHRpb25Nb3ZlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgY3VycmVudFBvaW50ID0ge1xyXG5cdFx0XHRcdFx0eDogdGhpcy5nYW1lLmlucHV0LngsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmdhbWUuaW5wdXQueVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubW92ZVRvKHRoaXMubGFzdFBvaW50LngsIHRoaXMubGFzdFBvaW50LnkpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lVG8oY3VycmVudFBvaW50LngsIGN1cnJlbnRQb2ludC55KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8odGhpcy5sYXN0UG9pbnQueCAtIHRoaXMuYm1kLmN0eC5saW5lV2lkdGggLyAyLCB0aGlzLmxhc3RQb2ludC55IC0gdGhpcy5ibWQuY3R4LmxpbmVXaWR0aCAvIDIpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lVG8oY3VycmVudFBvaW50LnggLSB0aGlzLmJtZC5jdHgubGluZVdpZHRoIC8gMiwgY3VycmVudFBvaW50LnkgLSB0aGlzLmJtZC5jdHgubGluZVdpZHRoIC8gMik7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LnN0cm9rZSgpO1xyXG5cclxuXHJcblx0XHRcdFx0dGhpcy5sYXN0UG9pbnQgPSBjdXJyZW50UG9pbnQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdGZpZnRoT3B0aW9uRG93bjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVKb2luID0gdGhpcy5ibWQuY3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRmaWZ0aE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBjdXJyZW50UG9pbnQgPSB7XHJcblx0XHRcdFx0XHR4OiB0aGlzLmdhbWUuaW5wdXQueCxcclxuXHRcdFx0XHRcdHk6IHRoaXMuZ2FtZS5pbnB1dC55XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguYmVnaW5QYXRoKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lm1vdmVUbyh0aGlzLmxhc3RQb2ludC54IC0gNCwgdGhpcy5sYXN0UG9pbnQueSAtIDQpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lVG8oY3VycmVudFBvaW50LngsIGN1cnJlbnRQb2ludC55KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5nbG9iYWxBbHBoYSA9IDAuNjtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubW92ZVRvKHRoaXMubGFzdFBvaW50LnggLSAyLCB0aGlzLmxhc3RQb2ludC55IC0gMik7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVUbyhjdXJyZW50UG9pbnQueCAtIDIsIGN1cnJlbnRQb2ludC55IC0gMik7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LnN0cm9rZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguZ2xvYmFsQWxwaGEgPSAwLjQ7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lm1vdmVUbyh0aGlzLmxhc3RQb2ludC54LCB0aGlzLmxhc3RQb2ludC55KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVRvKGN1cnJlbnRQb2ludC54LCBjdXJyZW50UG9pbnQueSk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LnN0cm9rZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguZ2xvYmFsQWxwaGEgPSAwLjM7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lm1vdmVUbyh0aGlzLmxhc3RQb2ludC54ICsgMiwgdGhpcy5sYXN0UG9pbnQueSArIDIpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lVG8oY3VycmVudFBvaW50LnggKyAyLCBjdXJyZW50UG9pbnQueSArIDIpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5zdHJva2UoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lmdsb2JhbEFscGhhID0gMC4yO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8odGhpcy5sYXN0UG9pbnQueCArIDQsIHRoaXMubGFzdFBvaW50LnkgKyA0KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVRvKGN1cnJlbnRQb2ludC54ICsgNCwgY3VycmVudFBvaW50LnkgKyA0KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMubGFzdFBvaW50ID0gY3VycmVudFBvaW50O1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaXh0aE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5ibWQud2lkdGgsIHRoaXMuYm1kLmhlaWdodCk7XHJcblx0XHRcdFx0dGhpcy5wb2ludHMucHVzaCh7IHg6IHRoaXMuZ2FtZS5pbnB1dC54LCB5OiB0aGlzLmdhbWUuaW5wdXQueSB9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5zdHJva2UodGhpcy5vZmZzZXRQb2ludHMoLXRoaXMuYm1kLmN0eC5saW5lV2lkdGggKiAyLjYpKTtcclxuXHRcdFx0XHR0aGlzLnN0cm9rZSh0aGlzLm9mZnNldFBvaW50cygtdGhpcy5ibWQuY3R4LmxpbmVXaWR0aCAqIDEuMikpO1xyXG5cdFx0XHRcdHRoaXMuc3Ryb2tlKHRoaXMucG9pbnRzKTtcclxuXHRcdFx0XHR0aGlzLnN0cm9rZSh0aGlzLm9mZnNldFBvaW50cyh0aGlzLmJtZC5jdHgubGluZVdpZHRoICogMS4yKSk7XHJcblx0XHRcdFx0dGhpcy5zdHJva2UodGhpcy5vZmZzZXRQb2ludHModGhpcy5ibWQuY3R4LmxpbmVXaWR0aCAqIDIuNikpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXZlbnRoT3B0aW9uTW92ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRQb2ludCA9IHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuZ2FtZS5pbnB1dC54LFxyXG5cdFx0XHRcdFx0eTogdGhpcy5nYW1lLmlucHV0LnlcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5nbG9iYWxBbHBoYSA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY2lyY2xlKGN1cnJlbnRQb2ludC54LCBjdXJyZW50UG9pbnQueSwgdGhpcy5ybmQuaW50ZWdlckluUmFuZ2UodGhpcy5ibWQuY3R4LmxpbmVXaWR0aCwgdGhpcy5ibWQuY3R4LmxpbmVXaWR0aCArIDEwKSwgJ3JlZCcpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlaWd0aE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgbmV3U2NhbGUgPSB0aGlzLmJtZC5jdHgubGluZVdpZHRoIC8gNTtcclxuXHRcdFx0XHR2YXIgaW1nID0gdGhpcy5tYWtlLmltYWdlKDAsIDAsICdpb25waGFzZXInKTtcclxuXHRcdFx0XHRpbWcuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0XHRcdGltZy5zY2FsZS5zZXQobmV3U2NhbGUgLyAxLjIpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmRyYXcoaW1nLCB0aGlzLmdhbWUuaW5wdXQueCwgdGhpcy5nYW1lLmlucHV0LnkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRuaW50aE9wdGlvbkRvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lSm9pbiA9IHRoaXMuYm1kLmN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuXHRcdFx0fSxcclxuXHRcdFx0bmludGhPcHRpb25Nb3ZlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgY3VycmVudFBvaW50ID0ge1xyXG5cdFx0XHRcdFx0eDogdGhpcy5nYW1lLmlucHV0LngsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmdhbWUuaW5wdXQueVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHRoaXMuZHJhd1BpeGVscyhjdXJyZW50UG9pbnQueCwgY3VycmVudFBvaW50LnkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZW50aE9wdGlvbkRvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lSm9pbiA9IHRoaXMuYm1kLmxpbmVDYXAgPSAncm91bmQnO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0ZW50aE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBkZW5zaXR5ID0gNTA7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSBkZW5zaXR5OyBpLS07KSB7XHJcblx0XHRcdFx0XHR2YXIgcmFkaXVzID0gdGhpcy5ibWQuY3R4LmxpbmVXaWR0aCAqIDI7XHJcblx0XHRcdFx0XHR2YXIgb2Zmc2V0WCA9IHRoaXMucm5kLmludGVnZXJJblJhbmdlKC1yYWRpdXMsIHJhZGl1cyk7XHJcblx0XHRcdFx0XHR2YXIgb2Zmc2V0WSA9IHRoaXMucm5kLmludGVnZXJJblJhbmdlKC1yYWRpdXMsIHJhZGl1cyk7XHJcblx0XHRcdFx0XHR0aGlzLmJtZC5jdHguZmlsbFJlY3QodGhpcy5nYW1lLmlucHV0LnggKyBvZmZzZXRYLCB0aGlzLmdhbWUuaW5wdXQueSArIG9mZnNldFksIDEsIDEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0ZWxldmVudGhPcHRpb25Eb3duOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZUpvaW4gPSB0aGlzLmJtZC5jdHgubGluZUNhcCA9ICdyb3VuZCc7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVsZXZlbnRoT3B0aW9uTW92ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRQb2ludCA9IHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuZ2FtZS5pbnB1dC54LFxyXG5cdFx0XHRcdFx0eTogdGhpcy5nYW1lLmlucHV0LnlcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHZhciBkZW5zaXR5ID0gNDA7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSBkZW5zaXR5OyBpLS07KSB7XHJcblx0XHRcdFx0XHR2YXIgYW5nbGUgPSB0aGlzLmdhbWUucm5kLnJlYWxJblJhbmdlKDAsIE1hdGguUEkgKiAyKTtcclxuXHRcdFx0XHRcdHZhciByYWRpdXMgPSB0aGlzLmdhbWUucm5kLnJlYWxJblJhbmdlKDAsIHRoaXMuYm1kLmN0eC5saW5lV2lkdGggKiA0KTtcclxuXHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5nbG9iYWxBbHBoYSA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdFx0XHR0aGlzLmJtZC5jdHguZmlsbFJlY3QoY3VycmVudFBvaW50LnggKyByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSksXHJcblx0XHRcdFx0XHRcdGN1cnJlbnRQb2ludC55ICsgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpLFxyXG5cdFx0XHRcdFx0XHR0aGlzLmdhbWUucm5kLnJlYWxJblJhbmdlKDEsIDIpLCB0aGlzLmdhbWUucm5kLnJlYWxJblJhbmdlKDEsIDIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHR3ZWxmdGhPcHRpb25Nb3ZlOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0dmFyIHRlbXBMaW5lV2lkdGggPSB0aGlzLmJtZC5jdHgubGluZVdpZHRoO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lV2lkdGggPSB0aGlzLmJtZC5jdHgubGluZVdpZHRoIC8gNTtcclxuXHJcblx0XHRcdFx0dGhpcy5wb2ludHMucHVzaCh7IHg6IHRoaXMuZ2FtZS5pbnB1dC54LCB5OiB0aGlzLmdhbWUuaW5wdXQueSB9KTtcclxuXHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8odGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMl0ueCwgdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMl0ueSk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVUbyh0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXS54LCB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXS55KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnBvaW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIGR4ID0gdGhpcy5wb2ludHNbaV0ueCAtIHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLng7XHJcblx0XHRcdFx0XHR2YXIgZHkgPSB0aGlzLnBvaW50c1tpXS55IC0gdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0ueTtcclxuXHRcdFx0XHRcdHZhciBkID0gZHggKiBkeCArIGR5ICogZHk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGQgPCAxMDAwKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwwLDAsMC4zKSc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8odGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0ueCArIChkeCAqIDAuMiksIHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLnkgKyAoZHkgKiAwLjIpKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVUbyh0aGlzLnBvaW50c1tpXS54IC0gKGR4ICogMC4yKSwgdGhpcy5wb2ludHNbaV0ueSAtIChkeSAqIDAuMikpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVdpZHRoID0gdGVtcExpbmVXaWR0aDtcclxuXHRcdFx0fSxcclxuXHRcdFx0dGhpcnRlZW50aE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgdGVtcExpbmVXaWR0aCA9IHRoaXMuYm1kLmN0eC5saW5lV2lkdGg7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVXaWR0aCA9IHRoaXMuYm1kLmN0eC5saW5lV2lkdGggLyA1O1xyXG5cclxuXHRcdFx0XHR0aGlzLnBvaW50cy5wdXNoKHsgeDogdGhpcy5nYW1lLmlucHV0LngsIHk6IHRoaXMuZ2FtZS5pbnB1dC55IH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lm1vdmVUbyh0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAyXS54LCB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAyXS55KTtcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVRvKHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLngsIHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLnkpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5zdHJva2UoKTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgZHggPSB0aGlzLnBvaW50c1tpXS54IC0gdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0ueDtcclxuXHRcdFx0XHRcdHZhciBkeSA9IHRoaXMucG9pbnRzW2ldLnkgLSB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXS55O1xyXG5cdFx0XHRcdFx0dmFyIGQgPSBkeCAqIGR4ICsgZHkgKiBkeTtcclxuXHJcblx0XHRcdFx0XHRpZiAoZCA8IDIwMDAgJiYgTWF0aC5yYW5kb20oKSA+IGQgLyAyMDAwKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwwLDAsMC4zKSc7XHJcblx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8odGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0ueCArIChkeCAqIDAuNSksIHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLnkgKyAoZHkgKiAwLjUpKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVUbyh0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXS54IC0gKGR4ICogMC41KSwgdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0ueSAtIChkeSAqIDAuNSkpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVdpZHRoID0gdGVtcExpbmVXaWR0aDtcclxuXHRcdFx0fSxcclxuXHRcdFx0Zm91cnRlZW50aE9wdGlvbkRvd246IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lSm9pbiA9IHRoaXMuYm1kLmN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldFBhdHRlcm4oKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Zm91cnRlZW50aE9wdGlvbk1vdmU6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgdGVtcExpbmVXaWR0aCA9IHRoaXMuYm1kLmN0eC5saW5lV2lkdGg7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVXaWR0aCA9IHRoaXMuYm1kLmN0eC5saW5lV2lkdGggKiA1O1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuYm1kLndpZHRoLCB0aGlzLmJtZC5oZWlnaHQpO1xyXG5cdFx0XHRcdHRoaXMucG9pbnRzLnB1c2goeyB4OiB0aGlzLmdhbWUuaW5wdXQueCwgeTogdGhpcy5nYW1lLmlucHV0LnkgfSk7XHJcblxyXG5cdFx0XHRcdHZhciBwMSA9IHRoaXMucG9pbnRzWzBdO1xyXG5cdFx0XHRcdHZhciBwMiA9IHRoaXMucG9pbnRzWzFdO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4Lm1vdmVUbyhwMS54LCBwMS55KTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDEsIGxlbiA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMucG9pbnRzW2ldLm5ld0xpbmUpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG1pZFBvaW50ID0gUGhhc2VyLlBvaW50LmNlbnRyb2lkKFtwMSwgcDJdKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LnF1YWRyYXRpY0N1cnZlVG8ocDEueCwgcDEueSwgbWlkUG9pbnQueCwgbWlkUG9pbnQueSk7XHJcblx0XHRcdFx0XHRcdHAxID0gdGhpcy5wb2ludHNbaV07XHJcblx0XHRcdFx0XHRcdHAyID0gdGhpcy5wb2ludHNbaSArIDFdO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cDEgPSB0aGlzLnBvaW50c1tpXTtcclxuXHRcdFx0XHRcdFx0cDIgPSB0aGlzLnBvaW50c1tpICsgMV07XHJcblx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8ocDEueCwgcDEueSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5saW5lVG8ocDEueCwgcDEueSk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LnN0cm9rZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVdpZHRoID0gdGVtcExpbmVXaWR0aDtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZmlmdGVlbnRoT3B0aW9uTW92ZTogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdC8qdGhpcy5sYXllcnMuZm9yRWFjaChmdW5jdGlvbiAoYm1kKSB7XHJcblx0XHRcdFx0Ym1kLmtleS5ibGVuZERlc3RpbmF0aW9uT3V0KCk7XHJcblx0XHRcdFx0Ym1kLmtleS5jaXJjbGUodGhpcy5nYW1lLmlucHV0LngsIHRoaXMuZ2FtZS5pbnB1dC55LCB0aGlzLmJtZC5jdHgubGluZVdpZHRoKjMsICdyZ2JhKDAsIDAsIDAsIDI1NScpO1xyXG5cdFx0XHRcdGJtZC5rZXkuYmxlbmRSZXNldCgpO1xyXG5cdFx0XHRcdGJtZC5rZXkuZGlydHkgPSB0cnVlO1xyXG5cdFx0XHRcdH0sIHRoaXMpOyovXHJcblxyXG5cdFx0XHRcdHRoaXMuYm1kLmNpcmNsZSh0aGlzLmdhbWUuaW5wdXQueCwgdGhpcy5nYW1lLmlucHV0LnksIHRoaXMuYm1kLmN0eC5saW5lV2lkdGggKiAzLCAnd2hpdGUnKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZHJhd1BpeGVsczogZnVuY3Rpb24oeCwgeSkge1xyXG5cclxuXHRcdFx0XHR2YXIgZG91YmxlTGluZVdpZHRoID0gdGhpcy5ibWQuY3R4LmxpbmVXaWR0aCAqIDIuNTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IC1kb3VibGVMaW5lV2lkdGg7IGkgPCBkb3VibGVMaW5lV2lkdGg7IGkgKz0gNCkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaiA9IC1kb3VibGVMaW5lV2lkdGg7IGogPCBkb3VibGVMaW5lV2lkdGg7IGogKz0gNCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYm1kLmN0eC5maWxsU3R5bGUgPSBbJ3JlZCcsICdvcmFuZ2UnLCAneWVsbG93JywgJ2dyZWVuJywgJ2xpZ2h0LWJsdWUnLCAnYmx1ZScsICdwdXJwbGUnXVt0aGlzLnJuZC5pbnRlZ2VySW5SYW5nZSgwLCA2KV07XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LmZpbGxSZWN0KHggKyBpLCB5ICsgaiwgNCwgNCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHN0cm9rZTogZnVuY3Rpb24ocG9pbnRzKSB7XHJcblx0XHRcdFx0dmFyIHAxID0gcG9pbnRzWzBdO1xyXG5cdFx0XHRcdHZhciBwMiA9IHBvaW50c1sxXTtcclxuXHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5tb3ZlVG8ocDEueCwgcDEueSk7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAxLCBsZW4gPSBwb2ludHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmICghcG9pbnRzW2ldLm5ld0xpbmUpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG1pZFBvaW50ID0gUGhhc2VyLlBvaW50LmNlbnRyb2lkKFtwMSwgcDJdKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5ibWQuY3R4LnF1YWRyYXRpY0N1cnZlVG8ocDEueCwgcDEueSwgbWlkUG9pbnQueCwgbWlkUG9pbnQueSk7XHJcblx0XHRcdFx0XHRcdHAxID0gcG9pbnRzW2ldO1xyXG5cdFx0XHRcdFx0XHRwMiA9IHBvaW50c1tpICsgMV07XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRwMSA9IHBvaW50c1tpXTtcclxuXHRcdFx0XHRcdFx0cDIgPSBwb2ludHNbaSArIDFdO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJtZC5jdHgubW92ZVRvKHAxLngsIHAxLnkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmJtZC5jdHgubGluZVRvKHAxLngsIHAxLnkpO1xyXG5cdFx0XHRcdHRoaXMuYm1kLmN0eC5zdHJva2UoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0b2Zmc2V0UG9pbnRzOiBmdW5jdGlvbih2YWwpIHtcclxuXHRcdFx0XHR2YXIgb2Zmc2V0UG9pbnRzID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dmFyIHBvaW50ID0gdGhpcy5wb2ludHNbaV07XHJcblx0XHRcdFx0XHRvZmZzZXRQb2ludHMucHVzaCh7XHJcblx0XHRcdFx0XHRcdHg6IHBvaW50LnggKyB2YWwsXHJcblx0XHRcdFx0XHRcdHk6IHBvaW50LnkgKyB2YWwsXHJcblx0XHRcdFx0XHRcdG5ld0xpbmU6IHBvaW50Lm5ld0xpbmVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gb2Zmc2V0UG9pbnRzO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRQYXR0ZXJuOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgZG90V2lkdGggPSAyMCxcclxuXHRcdFx0XHRcdGRvdERpc3RhbmNlID0gNTtcclxuXHJcblx0XHRcdFx0dmFyIHBhdHRlcm5DYW52YXMgPSB0aGlzLm1ha2UuYml0bWFwRGF0YShkb3RXaWR0aCArIGRvdERpc3RhbmNlLCBkb3RXaWR0aCArIGRvdERpc3RhbmNlKTtcclxuXHJcblx0XHRcdFx0cGF0dGVybkNhbnZhcy5jdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcblx0XHRcdFx0cGF0dGVybkNhbnZhcy5jdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0cGF0dGVybkNhbnZhcy5jdHguYXJjKGRvdFdpZHRoIC8gMiwgZG90V2lkdGggLyAyLCBkb3RXaWR0aCAvIDIsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcblx0XHRcdFx0cGF0dGVybkNhbnZhcy5jdHguY2xvc2VQYXRoKCk7XHJcblx0XHRcdFx0cGF0dGVybkNhbnZhcy5jdHguZmlsbCgpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmJtZC5jdHguY3JlYXRlUGF0dGVybihwYXR0ZXJuQ2FudmFzLmNhbnZhcywgJ3JlcGVhdCcpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRuZXdMYXllcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRMaW5lV2lkdGggPSB0aGlzLmJtZC5jdHgubGluZVdpZHRoO1xyXG5cdFx0XHRcdHRoaXMuYm1kID0gdGhpcy5nYW1lLmFkZC5iaXRtYXBEYXRhKHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCk7XHJcblx0XHRcdFx0dGhpcy5ibWQuY3R4LmxpbmVXaWR0aCA9IGN1cnJlbnRMaW5lV2lkdGg7XHJcblx0XHRcdFx0dGhpcy5sYXllcnMuYWRkKHRoaXMuYm1kLmFkZFRvV29ybGQoKSk7XHJcblx0XHRcdFx0dGhpcy5wb2ludHMgPSBbXTtcclxuXHRcdFx0fSxcclxuXHRcdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLmdhbWUuZGVidWcudGV4dCh0aGlzLmdhbWUudGltZS5mcHMgfHwgJy0tJywgMiwgMTQsIFwiIzAwZmYwMFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gc3RhdGU7XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbihQaGFzZXIpIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ1N0YXJXYXJzUGxheScsIFN0YXJXYXJzUGxheSk7XHJcblxyXG5cdC8vU3RhcldhcnNQbGF5LiRpbmplY3QgPSBbXTtcclxuXHRmdW5jdGlvbiBTdGFyV2Fyc1BsYXkoKSB7XHJcblx0XHRcclxuXHRcdHZhciBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweGZmZmZmZjtcclxuXHRcdFx0XHR0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcclxuXHRcdFx0XHR0aGlzLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XHJcblx0XHRcdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS51cGRhdGVMYXlvdXQoKTtcclxuXHRcdFx0fSxcclxuICAgICAgICAgICAgcHJlbG9hZDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbG9nbycsICdhc3NldHMvbG9nby5wbmcnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF1ZGlvKCdzdGFyd2FycycsIFsnYXVkaW8vc3Rhci13YXJzLXRoZW1lLm1wMyddKTsgIFxyXG4gICAgICAgICAgICB9LFxyXG5cdFx0XHRjcmVhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcndhcnMgPSB0aGlzLmFkZC5hdWRpbygnc3RhcndhcnMnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcndhcnMudm9sdW1lID0gMC43O1xyXG5cdFx0XHRcdC8vdGhpcy5zdGFyd2Fycy5sb29wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SW50cm8oKTtcclxuXHRcdFx0fSxcclxuICAgICAgICAgICAgc2hvd0ludHJvOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCh0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgdGhpcy5nYW1lLndvcmxkLmNlbnRlclksIFwiQSBsb25nIHRpbWUgYWdvLCBpbiBhIGdhbGF4eVxcbmZhciBmYXIgYXdheS4uLlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDogJzQwcHggXCJBcmlhbFwiJyxcclxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYig3NSwgMjEzLCAyMzgpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgd29yZFdyYXA6IHRydWUsIFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuZ2FtZS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmFscGhhID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5jdXJyZW50VGV4dCkudG8oIHsgYWxwaGE6IDEgfSwgNDAwLCBcIkxpbmVhclwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoUGhhc2VyLlRpbWVyLlNFQ09ORCAqIDEuNSwgdGhpcy5kZWNvZGVBdWRpbywgdGhpcykuYXV0b0Rlc3Ryb3kgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWNvZGVBdWRpbzogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zb3VuZC5zZXREZWNvZGVkQ2FsbGJhY2soWyB0aGlzLnN0YXJ3YXJzIF0sIHRoaXMuaGlkZUludHJvLCB0aGlzKTsgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoaWRlSW50cm86IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuLnRvKCB7IGFscGhhOiAwIH0sIDE1MDAsIFwiTGluZWFyXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50d2Vlbi5vbkNvbXBsZXRlLmFkZE9uY2UodGhpcy5zaG93TG9nbywgdGhpcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNob3dMb2dvOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ3YXJzLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nbyA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLCB0aGlzLmdhbWUud29ybGQuY2VudGVyWSwgXCJsb2dvXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nby5zY2FsZS5zZXQoMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmxvZ28pLnRvKCB7IGFscGhhOiAwIH0sIDQwMCwgXCJMaW5lYXJcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMubG9nby5zY2FsZSkudG8oIHsgeDogMC4wNSwgeTogMC4wNSB9LCA4MDAwLCBQaGFzZXIuRWFzaW5nLkxpbmVhci5Jbk91dCwgdHJ1ZSkuY2hhaW4odGhpcy50d2Vlbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuLm9uQ29tcGxldGUuYWRkKHRoaXMuc2hvdzNESGlzdG9yeSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNob3czREhpc3Rvcnk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGFyZW50LmNsYXNzTmFtZSArPSBcInN0YXJ3YXJzM0RcIjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCh0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgdGhpcy5nYW1lLndvcmxkLmhlaWdodCwgXCJFcGlzb2RlIElWXFxuQSBORVcgSE9QRVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDogJzYwcHggXCJBcmlhbFwiJyxcclxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBcIiNmZjZcIixcclxuICAgICAgICAgICAgICAgICAgICB3b3JkV3JhcDogdHJ1ZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgd29yZFdyYXBXaWR0aDogdGhpcy5nYW1lLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUuYW5jaG9yLnNldFRvKDAuNSwgMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlLmFkZEZvbnRXZWlnaHQoJ25vcm1hbCcsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZS5hZGRGb250V2VpZ2h0KCdib2xkJywgMTApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5lbmFibGUodGhpcy50aXRsZSwgUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUuYm9keS52ZWxvY2l0eS55ID0gLTMwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZS5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5zZXRTdHlsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDogJzcwMCA0NHB4IFwiQXJpYWxcIicsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogXCIjZmY2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd29yZFdyYXBXaWR0aDogdGhpcy5nYW1lLndpZHRoXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQucG9zaXRpb24ueSA9IHRoaXMuZ2FtZS53b3JsZC5oZWlnaHQgKyB0aGlzLnRpdGxlLmhlaWdodCArIDIwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5hbmNob3IueSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQuc2V0VGV4dChcIkl0IGlzIGEgcGVyaW9kIG9mIGNpdmlsIHdhci4gUmViZWwgc3BhY2VzaGlwcywgc3RyaWtpbmcgZnJvbSBhIGhpZGRlbiBiYXNlLCBoYXZlIHdvbiB0aGVpciBmaXJzdCB2aWN0b3J5IGFnYWluc3QgdGhlIGV2aWwgR2FsYWN0aWMgRW1waXJlLlxcblxcbkR1cmluZyB0aGUgYmF0dGxlLCBSZWJlbCBzcGllcyBtYW5hZ2VkIHRvIHN0ZWFsIHNlY3JldCBwbGFucyB0byB0aGUgRW1waXJlJ3MgdWx0aW1hdGUgd2VhcG9uLCB0aGUgREVBVEggU1RBUiwgYW4gYXJtb3JlZCBzcGFjZSBzdGF0aW9uIHdpdGggZW5vdWdoIHBvd2VyIHRvIGRlc3Ryb3kgYW4gZW50aXJlIHBsYW5ldC5cXG5cXG5QdXJzdWVkIGJ5IHRoZSBFbXBpcmUncyBzaW5pc3RlciBhZ2VudHMsIFByaW5jZXNzIExlaWEgcmFjZXMgaG9tZSBhYm9hcmQgaGVyIHN0YXJzaGlwLCBjdXN0b2RpYW4gb2YgdGhlIHN0b2xlbiBwbGFucyB0aGF0IGNhbiBzYXZlIGhlciBwZW9wbGUgYW5kIHJlc3RvcmUgZnJlZWRvbSB0byB0aGUgZ2FsYXh5Li4uLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmVuYWJsZSh0aGlzLmN1cnJlbnRUZXh0LCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5ib2R5LnZlbG9jaXR5LnkgPSAtMzA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmJlZm9yZVRvQXBwZWFyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRleHQuZXZlbnRzLm9uT3V0T2ZCb3VuZHMuYWRkKHRoaXMuc2hvd0VuZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNob3dFbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmN1cnJlbnRUZXh0LmJlZm9yZVRvQXBwZWFyKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmtpbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGFyZW50LmNsYXNzTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dvLnkgPSAtNTA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dvLmFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ28uc2NhbGUuc2V0KDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS53aWR0aCAvIHRoaXMubG9nby53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ28ud2lkdGggPSB0aGlzLmdhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dvLmhlaWdodCAqPSBzY2FsZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMubG9nbykudG8oIHsgeTogdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgfSwgMjQwMCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmJlZm9yZVRvQXBwZWFyID0gIXRoaXMuY3VycmVudFRleHQuYmVmb3JlVG9BcHBlYXI7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHJldHVybiBzdGF0ZTtcclxuXHR9XHJcbn0pKFBoYXNlcik7IiwiKGZ1bmN0aW9uKFBoYXNlcikge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXHJcbiAgICAgICAgLmZhY3RvcnkoJ1RpbmRlclBsYXknLCBUaW5kZXJQbGF5KTtcclxuXHJcbiAgICAvL1RpbmRlclBsYXkuJGluamVjdCA9IFtdO1xyXG4gICAgZnVuY3Rpb24gVGluZGVyUGxheSgpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8vdGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweGZmZmZmZjtcclxuXHRcdFx0XHR0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcclxuXHRcdFx0XHR0aGlzLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFO1xyXG5cdFx0XHRcdHRoaXMuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuRVhBQ1RfRklUO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUudXBkYXRlTGF5b3V0KCk7XHJcblx0XHRcdH0sXHJcbiAgICAgICAgICAgIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnaW9ucGhhc2VyJywgJ2Fzc2V0cy9pb25waGFzZXIucG5nJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xpa2UnLCAnYXNzZXRzL2xpa2UucG5nJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2Rpc2xpa2UnLCAnYXNzZXRzL2Rpc2xpa2UucG5nJyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYyA9IHRoaXMuZ2FtZS5tYWtlLmdyYXBoaWNzKDAsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLmxpbmVTdHlsZSgxLCAweEZGNkI2QiwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWMuYmVnaW5GaWxsKDB4RkY2QjZCLCAwLjgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljLmRyYXdDaXJjbGUoMCwgMCwgNTAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5lbmRGaWxsKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nbyA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLCB0aGlzLmdhbWUud29ybGQuY2VudGVyWSwgJ2lvbnBoYXNlcicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmxvZ28uc2NhbGUpLnRvKCB7IHg6IDAsIHk6IDAgfSwgMzAwLCBcIkJhY2suZWFzZUluXCIsIHRydWUsIDgwMCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSA9IHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5sb29wKDE1MDAsIHRoaXMuY3JlYXRlTmV3Q2lyY2xlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyTGlrZSA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcigwLCB0aGlzLmdhbWUuaGVpZ2h0LCA1MDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyTGlrZS5tYWtlUGFydGljbGVzKCdsaWtlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJMaWtlLnNldFJvdGF0aW9uKDAsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyTGlrZS5zZXRBbHBoYSgwLjEsIDEsIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyTGlrZS5zZXRTY2FsZSgwLjEsIDEsIDAuMSwgMSwgNjAwMCwgUGhhc2VyLkVhc2luZy5RdWludGljLk91dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJMaWtlLmdyYXZpdHkgPSAtMjAwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJEaXNMaWtlID0gdGhpcy5nYW1lLmFkZC5lbWl0dGVyKDAsIDAsIDUwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJEaXNMaWtlLm1ha2VQYXJ0aWNsZXMoJ2Rpc2xpa2UnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlckRpc0xpa2Uuc2V0Um90YXRpb24oMCwgMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJEaXNMaWtlLnNldEFscGhhKDAuMSwgMSwgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJEaXNMaWtlLnNldFNjYWxlKDAuMSwgMSwgMC4xLCAxLCA2MDAwLCBQaGFzZXIuRWFzaW5nLlF1aW50aWMuT3V0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlckRpc0xpa2UuZ3Jhdml0eSA9IDIwMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlTmV3Q2lyY2xlIDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNpcmNsZTEgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgdGhpcy5nYW1lLndvcmxkLmNlbnRlclksIHRoaXMuZ3JhcGhpYy5nZW5lcmF0ZVRleHR1cmUoKSk7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGUxLmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZTEuc2NhbGUuc2V0KDAuMTUpO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlMS5hbHBoYSA9IDAuNTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlcy5hZGQoY2lyY2xlMSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBjaXJjbGUyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUodGhpcy5nYW1lLndvcmxkLmNlbnRlclgsIHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZLCB0aGlzLmdyYXBoaWMuZ2VuZXJhdGVUZXh0dXJlKCkpO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlMi5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGUyLnNjYWxlLnNldCgwKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZTIuYWxwaGEgPSAwLjI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNpcmNsZXMuYWRkKGNpcmNsZTIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL2NpcmNsZTEudGludCA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2VlbihjaXJjbGUxLnNjYWxlKS50byggeyB4OiAzLCB5OiAzIH0sIDQwMDAsIFwiTGluZWFyXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2VlbihjaXJjbGUyLnNjYWxlKS50byggeyB4OiAyLjgsIHk6IDIuOCB9LCA0MDAwLCBcIkxpbmVhclwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2VlbihjaXJjbGUxKS50byggeyBhbHBoYTogMCB9LCAxMDAwLCBcIkxpbmVhclwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGQudHdlZW4oY2lyY2xlMikudG8oIHsgYWxwaGE6IDAgfSwgMTUwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBsYXk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2lyY2xlcyA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3Q2lyY2xlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGUudGltZXIuc3RhcnQoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaXJjbGVzLnJlbW92ZUFsbCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZS50aW1lci5zdG9wKGZhbHNlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGlrZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlckxpa2UuZW1pdFggPSB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKDAsIHRoaXMuZ2FtZS53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXJMaWtlLnN0YXJ0KHRydWUsIDUwMDAsIG51bGwsIDI2KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlzbGlrZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyRGlzTGlrZS5lbWl0WCA9IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoMCwgdGhpcy5nYW1lLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlckRpc0xpa2Uuc3RhcnQodHJ1ZSwgNTAwMCwgbnVsbCwgMjYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn0pKFBoYXNlcik7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
