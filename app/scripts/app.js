'use strict';

/**
 * @ngdoc overview
 * @name geoffoddieApp
 * @description
 * # geoffoddieApp
 *
 * Main module of the application.
 */
var app = angular.module('geoffoddieApp', [
	'ngAnimate',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ui.bootstrap',
	'wu.masonry'
]);

app.config([
	'$routeProvider',

	function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/photographer', {
				templateUrl: 'views/photographer.html',
				controller: 'PhotographerCtrl',
				reloadOnSearch: false
			})
			.when('/skills', {
				templateUrl: 'views/skills.html',
				controller: 'SkillsCtrl'
			})
			.when('/experience', {
				templateUrl: 'views/experience.html',
				controller: 'ExperienceCtrl'
			})
			.when('/achievements', {
				templateUrl: 'views/achievements.html',
				controller: 'AchievementsCtrl'
			})
			.when('/contact', {
				templateUrl: 'views/contact.html',
				controller: 'ContactCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

	}
]);

app.run([
	'$devices',
	'$window',
	'$rootScope',
	'$location',

	function($devices, $window, $rootScope, $location) {
		var randomNumber = Math.floor(Math.random() * 9) + 1;
		$('html').addClass('image_' + randomNumber);
		var navMain = $('#js-navbar-collapse');

		navMain.on('click', 'a', null, function() {
			navMain.collapse('hide');
			navMain.find('li').removeClass('active');
			$(this).parent().addClass('active');
		});

		$rootScope.$on('$routeChangeSuccess', function() {
			$('body').scrollTop(0);
			$rootScope.page = $location.path();
		});

	}
]);
