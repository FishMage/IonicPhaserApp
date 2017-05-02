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