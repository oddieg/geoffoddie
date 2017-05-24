'use strict';

/**
 * @ngdoc function
 * @name geoffoddieApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the geoffoddieApp
 */
app.controller('MainCtrl', ['$scope', '$devices', '$window',
	function($scope, $devices, $window) {

		$scope._getDocumentHeight = function() {
			return Math.max(
				Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
				Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
				Math.max(document.body.clientHeight, document.documentElement.clientHeight)
			);
		};


		$scope.browsers = $devices.browsers;
		$('.home').height(window.innerHeight - 120);

		angular.element($window).bind('resize', function() {
			$('.home').height(window.innerHeight - 120);
		});

	}
]);
