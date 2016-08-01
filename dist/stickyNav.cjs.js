'use strict';

/*
 * Sticky
 * https://github.com/apathetic/stickynav/
 *
 * Copyright (c) 2012, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */

/**
 * Sticky Element: sets up a sticky bar which attaches / detaches to top of viewport
 * @param {HTMLElement} element: The element to sticky-ify
 * @param {Boolean} bounded: Whether to apply stickiness to the bottom of the parent container.
 * @return {void}
 */
var Sticky = function Sticky(element, bounded) {
  var this$1 = this;
  if ( bounded === void 0 ) bounded=true;

  this.element = element instanceof HTMLElement ? element : document.querySelector(element);
  if (!this.element) { return false; }

  this.bounded = !!bounded;
  this.parent = this.element.parentNode;
  this.currentState = '_';
  this.stateSwitcher;
  this.determine = 'normal';

  // determine initial state
  if (this.element.getBoundingClientRect().top < 1) {
    this.setState('sticky');
    this.stateSwitcher();
  } else {
    this.setState('normal');
  }

  // window.addEventListener('scroll', this.stateSwitcher);  // stateSwitcher changes, so cannot pass (ie. bind directly) like this
  window.addEventListener('scroll', function () { this$1.stateSwitcher(); });
  window.addEventListener('resize', function () { this$1.stateSwitcher(); });
};

Sticky.prototype.normal = function normal () {
  var elementPosition = this.element.getBoundingClientRect();
  if (elementPosition.top < 1) {
    return this.setState('sticky');
  }
};

Sticky.prototype.sticky = function sticky () {
  var parentPosition = this.parent.getBoundingClientRect();
  if (parentPosition.top > 1) {
    return this.setState('normal');
  }
  if (this.bounded) {
    var elementPosition = this.element.getBoundingClientRect();
    if (parentPosition.bottom < elementPosition.bottom) {
      return this.setState('bottom');
    }
  }
};

Sticky.prototype.bottom = function bottom () {
  var elementPosition = this.element.getBoundingClientRect();
  if (elementPosition.top > 1) {
    return this.setState('sticky');
  }
};

Sticky.prototype.setState = function setState (state) {
  if (this.currentState === state) { return; }
  this.element.classList.remove(this.currentState);
  this.element.classList.add(state);
  this.currentState = state;
  this.stateSwitcher = this[state]; // stateSwitcher will point at an internal fn
};

function easeInOutCubic(t, b, c, d) {
  if ((t /= d / 2) < 1) { return c / 2 * t * t * t + b; }
  return c / 2 * ((t -= 2) * t * t + 2) + b;
}

/**
 * Scroll the page to a particular page anchor
 * @param  {String} to: The id of the element to scroll to.
 * @param  {Integer} offset: A scrolling offset.
 * @param  {Function} callback: Function to apply after scrolling
 * @return {void}
 */
function scrollPage(to, offset, callback) {
  if ( offset === void 0 ) offset = 0;

  var root = document.body;
  var duration = 500;
  var startTime;
  var startPos = root.scrollTop;
  var endPos = ~~(to.getBoundingClientRect().top - offset);

  var scroll = function (timestamp) {
    var elapsed;

    startTime = startTime || timestamp;
    elapsed = timestamp - startTime;
    root.scrollTop = easeInOutCubic(elapsed, startPos, endPos, duration);

    if (elapsed < duration) {
      requestAnimationFrame(scroll);
    } else {
      callback.call(to);
    }
  };

  requestAnimationFrame(scroll);
}

// import * as Scroll from '@apatheticwes/scrollify';

console.log(Scroll.scrollPage);

var handle;
var sections;
var items = [];
var isScrolling = false;
var currentSection = null;
var ticking = false;


function stickyNav (options) {
  if ( options === void 0 ) options={};

  var offset = options.offset || 0;
  var bounded = options.bounded || false;

  handle = document.querySelector(options.nav);
  sections = options.sections || document.querySelectorAll('[data-nav]');

  if ( !sections || !handle ) { console.log('StickyNav: missing nav or nav sections.'); return false; }

  new Sticky(handle, bounded);

  generate();
  checkSectionPosition();
  window.addEventListener('scroll', updateActiveItem);
}




/**
 * Generate the nav <li>'s and setup the Event Listeners
 * @return {void}
 */
function generate() {
  var nav = handle.querySelector('ul');

  Array.from(sections, function (section) {
    var title = section.getAttribute('data-nav');
    var id = section.id || '';
    var item = document.createElement('li');

    item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
    item.addEventListener('click', function (e) {
      e.preventDefault();
      items.forEach(function (i) { i.className = ''; });
      item.classList.add('active');
      scrollPage(section);
    });

    items.push(item);
    nav.appendChild(item);
  });
}


/**
 * Update the active nav item on window.scroll
 * @return {void}
 */
function updateActiveItem() {
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
  var i = sections.length;

  // Find i. Start at end and work back
  for (i; i--;) {
    if (~~sections[i].getBoundingClientRect().top <= 0) {    // note: ~~ is Math.floor
      break;
    }
  }

  // Add active class to currentSection, or remove if nothing is currently active
  if (i !== currentSection) {
    items.forEach(function (item) { item.classList.remove('active'); });
    if (i >= 0) {
      items[i].classList.add('active');
    }
    currentSection = i;
  }

  ticking = false;
}

module.exports = stickyNav;