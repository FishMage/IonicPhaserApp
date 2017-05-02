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