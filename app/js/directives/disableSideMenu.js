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