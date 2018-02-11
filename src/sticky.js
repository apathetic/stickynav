/*
 * Sticky
 * https://github.com/apathetic/stickynav/
 *
 * Copyright (c) 2012, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */

import polyfill from './polyfills.js';
polyfill();


// mini querySelector helper fn
function $(el) {
  return el instanceof HTMLElement ? el : document.querySelector(el);
}

// Sticky element default options
const defaults = {
  offset: 0,
  boundedBy: false //  Defaults to the parent, but can be any element in the page.
}

// Sticky Event
const stickyEvent = new CustomEvent('sticky', {
  bubbles: true
});


/**
 * Set up a sticky element that attaches / detaches to top of viewport.
 * @param {HTMLElement} element The element to sticky-ify
 * @param {Object} options The options object
 * @param {boolean|HTMLElement} options.boundedBy Bounding element for the sticky element, or "true" to use the parent node
 * @param {number} options.offset An offset from the top at which to toggle "stickiness"
 * @return {void}
 */
export default class Sticky {

  constructor(element, options) {
    this.element = $(element);

    if (!this.element) { return false; }

    // this.opts = Object.assign({}, defaults, options);
    this.opts = {};
    for (let opt in defaults) { this.opts[opt] = defaults[opt]; }
    for (let opt in options) { this.opts[opt] = options[opt]; }

    this.stateSwitcher;
    this.currentState = null;
    this.determine = 'normal';
    this.bounded = !!this.opts.boundedBy;
    this.parent = (typeof this.opts.boundedBy === 'boolean') ? this.element.parentNode : $(this.opts.boundedBy);

    // determine initial state
    if (this.element.getBoundingClientRect().top < this.opts.offset) {
      this.setState('sticky');
      this.stateSwitcher();
    } else {
      this.setState('normal');
    }

    window.addEventListener('scroll', () => { this.stateSwitcher(); });
    window.addEventListener('resize', () => { this.stateSwitcher(); });
  }

  normal() {
    const elementPosition = this.element.getBoundingClientRect();
    if (elementPosition.top < this.opts.offset) {
      return this.setState('sticky');
    }
  }

  sticky() {
    const parentPosition = this.parent.getBoundingClientRect();
    if (parentPosition.top > this.opts.offset) {
      return this.setState('normal');
    }

    if (this.bounded) {
      const elementPosition = this.element.getBoundingClientRect();
      if (parentPosition.bottom < elementPosition.bottom) {
        return this.setState('bottom');
      }
    }
  }

  bottom() {
    const elementPosition = this.element.getBoundingClientRect();
    if (elementPosition.top > this.opts.offset) {
      return this.setState('sticky');
    }
  }

  setState(state) {
    if (this.currentState === state) { return; }
    this.element.classList.remove(this.currentState);
    this.element.classList.add(state);
    this.currentState = state;
    this.stateSwitcher = this[state];   // stateSwitcher will point at an internal fn

    if (state === 'sticky') {
      this.element.dispatchEvent(stickyEvent); // , { detail: state });
    }
  }
}
