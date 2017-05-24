'use strict';

/**
 * @ngdoc function
 * @name geoffoddieApp.controller:PhotographerCtrl
 * @description
 * # PhotographerCtrl
 * Controller of the geoffoddieApp
 */
app.controller('PhotographerCtrl', [
	'$scope',
	'$http',
	'$modal',
	'$timeout',
	'$devices',
	'$location',

	function($scope, $http, $modal, $timeout, $devices, $location) {
		if ($devices.browsers.desktop) {
			$scope.limit = 25;
		} else if ($devices.browsers.tablet) {
			$scope.limit = 16;
		} else {
			$scope.limit = 5;
		}

		$http.get('/json/photos.json').success(function(data) {
			$scope.temp = data.photos[0];


			// $scope.photoArray = $.map($scope.temp, function(value, index) {
			// 	return [value, index];
			// });
			$scope.photoArray = [];
			for (var key in $scope.temp) {
				if ($scope.temp.hasOwnProperty(key)) {
					var object = $scope.temp[key];
					object.id = key;
					$scope.photoArray.push(object);
				}
			}



			$scope.numberOfPhotos = $scope.photoArray.length;

			for (var i = 0; i < Math.floor($scope.numberOfPhotos / 8); i++) {
				var random = Math.floor((Math.random() * $scope.photoArray.length - 2) + 2);
				$scope.photoArray[random].larger = true;
			}




			shuffleArray($scope.photoArray);
			$scope.photos = $scope.photoArray.slice(0, $scope.limit);

			$scope._addScrollListener();

			$scope.loc = $location;
			$scope.$watch('(loc.search()).photo', function (val) {
				if ($scope.temp[val]) {
					$scope.open(val);
				}
			});


		});
		$scope.handleClick = function(id) {
			$location.search('photo', id);
		};
		$scope._getDocumentHeight = function() {
			return Math.max(
				Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
				Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
				Math.max(document.body.clientHeight, document.documentElement.clientHeight)
			);
		};

		// Handle what to do when we scroll
		$scope._scrollHandler = function() {
			// Check for the bottom of the page
			var docHeight = $devices.browsers.desktop ? $(document).height() : $scope._getDocumentHeight() - 60;
			if ($(window).height() + $(window).scrollTop() >= docHeight && !$scope.busy) {
				// Check if we are already loading
				$scope.busy = true;
				$scope.increaseLimit();
			}
		};

		// Add the scroll listener
		$scope._addScrollListener = function() {
			$(window).scroll($scope._scrollHandler);
		};

		// Removes the scroll listener
		$scope._removeScrollListener = function() {
			$(window).off('scroll', $scope._scrollHandler);
		};

		$scope.increaseLimit = function() {
			if ($devices.browsers.desktop) {
				$scope.limit += 20;
			} else if ($devices.browsers.tablet) {
				$scope.limit += 12;
			} else {
				$scope.limit += 6;
			}

			if ($scope.limit < $scope.numberOfPhotos) {
				$scope.photos = $scope.photoArray.slice(0, $scope.limit);
			} else {
				$scope._removeScrollListener();
			}

			$timeout(function() {
				$scope.$digest();
				$scope.busy = false;
			});
		};

		$scope.open = function(id) {
			$modal.open({
				templateUrl: 'views/modules/modal.html',
				controller: 'ModalInstanceCtrl',

				resolve: {
					photo: function() {
						return $scope.temp[id];
					},
					id: function() {
						return id;
					},

				}
			});
		};

		// -> Fisher–Yates shuffle algorithm
		var shuffleArray = function(array) {
			var m = array.length,
				t, i;

			// While there remain elements to shuffle
			while (m) {
				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		};

	}
]);
