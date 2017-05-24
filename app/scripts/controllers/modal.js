'use strict';
app.controller('ModalInstanceCtrl', [
	'$scope',
	'$modalInstance',
	'$location',
	'photo',
	'id',

	function($scope, $modalInstance, $location, photo, id) {
		$scope.photo = photo;
		$scope.id = id;


		$scope.cancel = function() {
			$location.search('photo', null);
			$modalInstance.dismiss('cancel');
		};
	}
]);
