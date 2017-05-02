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