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