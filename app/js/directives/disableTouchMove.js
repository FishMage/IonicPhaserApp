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