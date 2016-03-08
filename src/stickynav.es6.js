/*
 * sticky nav
 * https://github.com/apathetic/stickynav
 *
 * Copyright (c) 2013, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */



/**
 * Sticky Element: sets up a sticky bar which attaches / detaches to top of viewport
 * @param {HTMLElement} sticky The element to sticky-ify
 * @return {void}
 */
export function stickyElement(sticky, bounded) {

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




/**
 * Sticky Nav: creates a sticky side navigation using data- attributes from the page
 * @return ....
 */
export class stickyNav {

	/**
	 * Generate the nav <li>'s and setup the Event Listeners
	 * @return {void}
	 */
	generateMenu() {
		var nav = this.handle.querySelector('ul');

		Array.from(this.sections, (section) => {
			let title = section.getAttribute('data-nav'),
				id = section.id || '',
				item = document.createElement('li');

			item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
			item.addEventListener('click', (e) => {
				e.preventDefault();
				this.items.forEach((itm) => { itm.className = ''; });
				item.classList.add('active');
				this.scrollPage(section);
			});

			this.items.push(item);
			nav.appendChild(item);

		});
	}

	/**
	 * Update the active nav item on window.scroll
	 * @return {void}
	 */
	updateSelectedItem() {
		if (!this.ticking && !this.isScrolling) {
			this.ticking = true;
			requestAnimationFrame(this.checkSectionPosition.bind(this));
		}
	}

	/**
	 * Check each section's getBoundingClientRect to determine which is active
	 * @return {void}
	 */
	checkSectionPosition() {
		var i = this.sections.length;		// don't use "let" as we need "i", below

		// Find i. Start at end and work back
		for (i; i--;) {
			if ( ~~this.sections[i].getBoundingClientRect().top <= 0 ) {		// note: ~~ is Math.floor
				break;
			}
		}

		// Add active class to currentSection, or remove if nothing is currently active
		if (i !== this.currentSection) {
			this.items.forEach((item) => { item.classList.remove('active'); });
			if (i >= 0) {
				this.items[i].classList.add('active');
			}
			this.currentSection = i;
		}

		this.ticking = false;
	}

	/**
	 * Scroll the page to a particular page anchor
	 * @param  {string} to	id of the element to scroll to
	 * @return {void}
	 */
	scrollPage(to, offset, callback) {

		offset = offset || 0;

		var root = document.body;
		var duration = 500;
		var self = this;
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
				self.isScrolling = false;
				// callback.call(to);
			}
		 }

		 this.isScrolling = true;
		 requestAnimationFrame(scroll);
	}


	constructor(options={}) {

		this.items = [];
		this.ticking = false;
		this.isScrolling = false;
		this.currentSection = null;
		this.sections = document.querySelectorAll('[data-nav]');
		this.handle = document.querySelector(options.nav);

		if ( !this.sections || !this.handle ) { return false; }

		var bounded = options.bounded || false;
			// offset = options.offset || 0,
			// onScroll = options.onScroll \| false

		this.generateMenu();
		this.checkSectionPosition();

		stickyElement(this.handle, bounded);

		window.addEventListener('scroll', this.updateSelectedItem.bind(this));
	}


}
