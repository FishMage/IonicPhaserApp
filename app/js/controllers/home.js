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
            }, 50);
        };
	}
})();