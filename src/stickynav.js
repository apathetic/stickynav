/*
 * sticky nav
 * https://github.com/apathetic/stickynav
 *
 * Copyright (c) 2013 Wes Hatch
 * Licensed under the MIT license.
 *
 */



/**
 * Sticky Element: sets up a sticky bar which attaches / detaches to top of viewport
 * @param {HTMLElement} sticky The element to sticky-ify
 * @return {void}
 */
function stickyElement(sticky, bounded) {

	if (!sticky || !sticky.getBoundingClientRect) {
		return false;                                       // progressive enhancement for newer browers only.
	}

	bounded = bounded || sticky.getAttribute('data-bounded') || false;

	var parent = sticky.parentNode,
		stickyPosition,
		parentPosition,
		currentState = '',
		stateSwitcher,
		determine = {
			normal: function() {
				stickyPosition = sticky.getBoundingClientRect();
				if (stickyPosition.top < 1) { return setState('sticky'); }
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


var sectionNav = (function(handle, options) {

	var sections = document.querySelectorAll('[data-nav]'),
		nav = handle.querySelector('ul'),
		items = [],     // document.createDocumentFragment(),  //[];
		currentSection,
		ticking,
		offset = options.offset || 0,
		bounded = options.bounded || false,
		isScrolling = false;

	generateMenu();         // TODO make into an option? ie whether to generate menu automatically or not?
	checkSectionPosition();

	Sprout.Components.stickyElement(handle, options.bounded);
	window.addEventListener('scroll', updateSelected);


	// SectionNav.prototype = {

	/**
	 * Generate the nav <li>'s and setup the Event Listeners
	 * @return {void}
	 */
	function generateMenu() {

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
		if (!ticking && !isScrolling) {
			ticking = true;
			window.requestAnimationFrame(checkSectionPosition);
		}
	}

	/**
	 * Check each section's getBoundingClientRect to determine which is active
	 * @return {void}
	 */
	function checkSectionPosition() {
		var i;

		// Find i. Start at end and work back
		for (i = sections.length; i--;) {
			if ( ~~sections.get(i).getBoundingClientRect().top <= 0 ) {		// note: ~~ is Math.floor
				break;
			}
		}

		if (i !== currentSection) {
			currentSection = i;
			items.removeClass('active');
			items.eq(currentSection).addClass('active');
		}
		// if (i < 0) {
        //     if (currentSection >= 0) {
        //         $(items[currentSection]).removeClass('active');
        //     }
        //     currentSection = i;
        // }
        // else if (i !== currentSection) {
        //     if (currentSection >= 0) {
        //         $(items[currentSection]).removeClass('active');
        //     }
        //     $(items[i]).addClass('active');
        //     currentSection = i;
        // }


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
				generateMenu();
				checkSectionPosition();
			// }
		}
	};


}()));
