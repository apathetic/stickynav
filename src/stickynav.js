/*
 * sticky nav
 * https://github.com/apathetic/stickynav
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 *
 */


var stickyNav = (function($, window, undefined ) {

	'use strict';

	var sticky,
		sections,
		currentSection,
		// scrollPosition = window.pageYOffset,
		// offsets = [],
		// timer,
		ticking,
		items = $();


	/**
	 * Sets up a sticky bar which attaches / detaches to top of viewport
	 * @return {void}
	 */
	function setupSticky() {

		// var body = document.body,		// $('body')[0],	// local reference
		var offset,
			position,
			_currentState = '',
			_stateSwitcher,
			determine = {
				normal: function() {
					position = sticky.getBoundingClientRect();
					if (position.top < 1 ) { return setState('sticky'); }
				},
				sticky: function() {
					position = document.body.getBoundingClientRect();
					if( position.top > offset ) { return setState('normal'); }
				},
				bottom: function() {
					//
					//
				}
			};

		function setState (state){
			if(_currentState == state) { return; }
			$(sticky).removeClass(_currentState).addClass(state);
			_currentState = state;
			_stateSwitcher = determine[state];
		}

		position = sticky.getBoundingClientRect();
		offset = -(position.top + window.scrollY);	// store original offset

		//sticky initial position
		if (window.pageYOffset > position.top) {
			setState('sticky');
		} else {
			setState('normal');
		}

		//$(window).on({ 'scroll': function(){ _stateSwitcher() } });
		window.addEventListener('scroll', function(){ _stateSwitcher(); });
	}

	/**
	 * Generate the nav <li>'s and setup the Event Listeners
	 * @return {void}
	 */
	function setupPageNav() {

		var nav = $(sticky).find('ul');

		sections.each(function(i, section) {
			var title = $(this).data('nav'),
				id = $(this).attr('id') || '',
				item = $('<li><a href="#'+id+'">'+ title + '</a></li>');	// [TODO]: option to use other elements ie. <td>

			item.click(function(e) {
				e.preventDefault();
				items.removeClass();
				$(this).addClass('active');
				scrollPage(section);
			});

			items = items.add(item);
			// offsets.push( $(section).offset().top );		// previously stored all offsets, but this only works if sections are not dynamic
			nav.append(item);

		});

		window.addEventListener('scroll', updateSelected);
	}

	/**
	 * Update the active nav item on window.scroll
	 * @return {void}
	 */
	function updateSelected() {
		// clearTimeout(timer);
		// timer = window.setTimeout(checkSectionPosition, 100);
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(checkSectionPosition);
		}
	}

	/**
	 * Check each section's getBoundingClientRect to determine which is active
	 * @return {void}
	 */
	function checkSectionPosition() {

		// currentSection = undefined;		// reset

		// start at end at work back
		for (var i = sections.length; i--;) {
			if ( ~~sections.get(i).getBoundingClientRect().top <= 0 ) {		// note: ~~ is Math.floor
				break;
			}
		}

		if (i !== currentSection) {
			currentSection = i;
			items.removeClass('active');
			items.eq(currentSection).addClass('active');
		}

		ticking = false;
	}

	/**
	 * Scroll the page to a particular page anchor
	 * @param  {string} to	id of the element to scroll to
	 * @return {void}
	 */
	function scrollPage(to) {
		if ($(to).length) {
			$('html, body').animate({
				scrollTop: $(to).offset().top
			}, 500);
		}
	}



	return {
		init: function(opts) {
			// if(!core.Utils.isTouchDevice && sections.length > 0) {
				sticky = $(opts.nav)[0];	// [TODO] add some checks or sumthing
				sections = $('[data-nav]');
				if ( !sections || !sticky || !sticky.getBoundingClientRect) { return false; } // progressive enhancement for newer browers only.

				setupSticky();
				setupPageNav();
				checkSectionPosition();
			// }
		}
	};


}( jQuery, window ));

