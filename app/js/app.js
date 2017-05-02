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
                        templateUrl: "templates/dragon.html",
                        controller: 'DragonController'
                    }
                }
            })
            .state('app.signature', {
                url: "/signature",
                views: {
                    viewContent: {
                        templateUrl: "templates/signature.html",
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
