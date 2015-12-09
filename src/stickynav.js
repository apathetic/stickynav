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
		return false;									   // progressive enhancement for newer browers only.
	}

	bounded = bounded || sticky.getAttribute('data-bounded') || false;

	var parent = sticky.parentNode,
		stickyPosition,
		parentPosition,
		currentState = '_',
		stateSwitcher,
		determine = {
			normal:function(){
				stickyPosition = sticky.getBoundingClientRect();
				if (stickyPosition.top < 1) { return setState('sticky'); }
			},
			sticky:function(){
				parentPosition = parent.getBoundingClientRect();
				if (parentPosition.top > 1) { return setState('normal'); }
				if (!bounded) { return; }   // don't worry about bottom edge
				stickyPosition = sticky.getBoundingClientRect();
				if (parentPosition.bottom < stickyPosition.bottom) { return setState('bottom'); }
			},
			bottom: function(){
				stickyPosition = sticky.getBoundingClientRect();
				if (stickyPosition.top > 1) { return setState('sticky'); }
			}
		};

	function setState (state){
		if (currentState === state) { return; }
		sticky.classList.remove(currentState);
		sticky.classList.add(state);
		currentState = state;
		stateSwitcher = determine[state];
	}

	stickyPosition = sticky.getBoundingClientRect();

	//sticky initial position
	if (stickyPosition.top < 1) {
		setState('sticky');
		stateSwitcher();		// edge case: check if bottom of sticky collides w/ bounding container
	} else {
		setState('normal');
	}

	// window.addEventListener('scroll', stateSwitcher);
	window.addEventListener('scroll', function(){ stateSwitcher(); });	// stateSwitcher changes, so cannot pass (ie. bind directly) here
	window.addEventListener('resize', function(){ stateSwitcher(); });
}





var stickyNav = (function() {

	var handle,
		sections;

	var items = [],
		currentSection,
		ticking,
		isScrolling = false;

	/**
	 * Generate the nav <li>'s and setup the Event Listeners
	 * @return {void}
	 */
	function generateMenu() {

		var nav = handle.querySelector('ul');

		Array.prototype.forEach.call(sections, function(section) {
			var title = section.getAttribute('data-nav'),
				id = section.id || '',
				item = document.createElement('li');

			item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
			item.addEventListener('click', function(e) {
				e.preventDefault();
				items.forEach(function(item) { item.className = ''; });
				this.classList.add('active');
				scrollPage(section);
			});

			items.push(item);
			nav.appendChild(item);

		});

		window.addEventListener('scroll', updateSelectedItem);
	}

	/**
	 * Update the active nav item on window.scroll
	 * @return {void}
	 */
	function updateSelectedItem() {
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
			if ( ~~sections[i].getBoundingClientRect().top <= 0 ) {		// note: ~~ is Math.floor
				break;
			}
		}

		// Add active class to currentSection, or remove if nothing is currently active
		if (i !== currentSection) {
			items.forEach(function(item) { item.classList.remove('active'); });
			if (i >= 0) {
				items[i].classList.add('active');
			}
			currentSection = i;
		}


		ticking = false;
	}

	/**
	 * Scroll the page to a particular page anchor
	 * @param  {string} to	id of the element to scroll to
	 * @return {void}
	 */
	function scrollPage(to, offset, callback) {

		offset = offset || 0;

		var root = document.body;
		var duration = 500;
		var startTime,
			startPos = root.scrollTop,
			endPos = ~~(to.getBoundingClientRect().top - offset);

		function easeInOutCubic(t, b, c, d) {
			if ((t/=d/2) < 1) { return c/2*t*t*t + b; }
			return c/2*((t-=2)*t*t + 2) + b;
		}

		function scroll(timestamp) {
			startTime = startTime || timestamp;
			var elapsed = timestamp - startTime;
			root.scrollTop = easeInOutCubic(elapsed, startPos, endPos, duration);
			if (elapsed < duration) {
				 requestAnimationFrame(scroll);
			} else {
				isScrolling = false;
				// callback.call(to);
			}
		 }

		 isScrolling = true;
		 requestAnimationFrame(scroll);
	}


	return {
		init: function(options) {

			options = options || {};

			sections = document.querySelectorAll('[data-nav]');
			handle = document.querySelector(options.nav);

			if ( !sections || !handle ) { return false; }

			var offset = options.offset || 0,
				bounded = options.bounded || false;
				// onScroll = options.onScroll \| false

			generateMenu();
			checkSectionPosition();
			stickyElement(handle, bounded);

			window.addEventListener('scroll', updateSelectedItem);

		}
	};


})();
