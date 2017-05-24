'use strict';

/**
 * Service: Device Detection Abstracted out
 */
app.service('$devices', [
	'$rootScope', // For broadcasting events
	'$window', // Reference to the current window

	function($rootScope, $window) {

		/**
		 * BROWSER DETECTION
		 *
		 * init variables; test all UA patterns; clean up variables; add CSS classes to HTML tag; store in $rootScope
		 */
		var ua = String(navigator.userAgent || navigator.vendor || window.opera),
			browsersDetected = [],
			browsers = {
				'mobile': /\bMobile\b/,
				'mobile_app': /Mobile Safari*/g,
				'samsung_3': /\bSAMSUNG-SGH-I747\b/,
				'samsung': /\bSAMSUNG\b/,
				'samsung_new': /\bSM-\b/,
				'tablet': /\bTablet\b/,
				'android': /\bAndroid\b/,
				'nexus10': /Nexus 10*/g,
				'ios': /\biP(ad|hone|od)\b/,
				'ipad': /\biPad\b/,
				'iphone': /\biPhone\b/,
				'ipod': /\biPod\b/,
				'mac': /\bMacintosh\b/,
				'linux': /\bLinux\b/,
				'windows': /\bWindows\b/,

				'chrome': /\bChrome\/|\bchromeframe\//,
				'firefox': /\bFirefox\b/,
				'ie': /\bMSIE\b/,
				'ie8': /\bMSIE 8\b/,
				'ie9': /\bMSIE 9\b/,
				'ie11': /\bTrident\/7.0\b/,

				'opera': /\bOpera\b/,
				'safari': /\bSafari\//,
				'webkit': /\bAppleWebKit\//,
			},
			i = 0;

		for (i in browsers) {
			browsers[i] = !!browsers[i].test(ua);
		}

		if (browsers.ie11) {
			browsers.ie = true;
		}

		if (browsers.ios) {
			var uaindex = ua.indexOf('OS ');

			browsers.iosVersion = Number(ua.substr(uaindex + 3, 3).replace('_', '.'));
			browsers['iosVer' + ua.substr(uaindex + 3, 1)] = true;

			if (browsers.ipad) {
				browsers.tablet = true;
				browsers.mobile = false;
			} else if (browsers.iphone || browsers.ipod) {
				browsers.mobile = true;
				browsers.tablet = false;
			}
		}

		/**
		 * We are saying that anything over 600px in width is a tablet
		 *
		 * *** Android devices have 'Mobile' in UA for phones so if no 'mobile' : its a tablet
		 */
		if (browsers.android) {

			if (!browsers.chrome) {
				browsers.badbrowser = true;
			}

			if (browsers.mobile) {
				browsers.tablet = false;
				browsers.mobile = true;
			} else {
				browsers.tablet = true;
				browsers.mobile = false;
			}

		}

		browsers.native = false;
		browsers.desktop = (!browsers.mobile && !browsers.tablet);

		if (browsers.android && browsers.linux) {
			browsers.linux = false;
		}

		if (browsers.chrome && browsers.safari) {
			browsers.safari = false;
		}

		for (i in browsers) {
			if (browsers[i]) {
				browsersDetected.push(i);
				$('html').addClass(i);
			}
		}

		// Detect SVG support ~ there is no HTTPS link for this
		var svgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
		browsers.svgSupport = svgSupport;

		// Check for IE11 ~ User agent does not return 'MSIE' so we need to do an additional check.
		if ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})').exec(navigator.userAgent) !== null))) {
			browsers.ie = true;
		}

		// Orientation change event / setup
		var checkOrientation = function() {

			// Set desktop to portrait...
			if (browsers.desktop) {
				browsers.landscape = false;
				browsers.portrait = true;
			} else if (browsers.nexus10) {
				browsers.landscape = (window.orientation === 0 || window.orientation === 180) ? true : false;
				browsers.portrait = !browsers.landscape;
			} else {
				browsers.landscape = (window.orientation === 90 || window.orientation === -90) ? true : false;
				browsers.portrait = !browsers.landscape;
			}
		};

		checkOrientation();

		/**
		 * Orientation events
		 */
		angular.element($window).bind('orientationchange', function() {
			checkOrientation();
		});

		// Set some defaults on the rootScope
		$rootScope.browsers = browsers;
		$rootScope.browsersDetected = browsersDetected;
		$rootScope.isMobile = browsers.mobile;

		return {
			browsers: browsers
		};
	}
]);
