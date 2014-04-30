/*
 * collision manager
 * https://github.com/apathetic/stickynav
 *
 * Copyright (c) 2014 Wes Hatch
 * Licensed under the MIT license.
 *
 */


var collisionManager = (function($, window, undefined ) {

	'use strict';

	var target,
		obstacles,
		collision,
		timer;


	/**
	 * Watch for collisions
	 * @return {void}
	 */
	function onScroll() {
		// clearTimeout(timer);
		// timer = window.setTimeout(checkCollisions, 100);
		window.requestAnimationFrame(checkCollisions);
	}

	/**
	 * Checks if one of the obstacles is intersecting with the target
	 * @return {void}
	 */
	function checkCollisions() {

		collision = false;		// reset

		for (var i = obstacles.length; i--;) {
			if (
				obstacles.get(i).getBoundingClientRect().top <= target.getBoundingClientRect().bottom &&
				obstacles.get(i).getBoundingClientRect().bottom >= target.getBoundingClientRect().top
			) {
				collision = true;
				break;
			}
		}

		// window.console.log(collision);

		$(target).toggleClass('hidden', collision);

	}



	return {
		init: function(opts) {
			// [TODO] add some checks or sumthing
			target = $(opts.target)[0];
			obstacles = $(opts.obstacles);

			window.addEventListener('scroll', onScroll);

		}
	};


}( jQuery, window ));

