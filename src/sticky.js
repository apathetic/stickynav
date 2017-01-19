/*
 * Sticky
 * https://github.com/apathetic/stickynav/
 *
 * Copyright (c) 2012, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */

// mini querySelector helper fn
function $(el) {
  return el instanceof HTMLElement ? el : document.querySelector(el);
}

/**
 * Set up a sticky element that attaches / detaches to top of viewport.
 * @param {HTMLElement} element         The element to sticky-ify
 * @param {HTMLElement} boundingElement The bounding element for the sticky element.
 *                                      Defaults to the parent, but can be any
 *                                      element in the page.
 * @return {void}
 */
export default class Sticky {

  constructor(element, boundingElement = false) {
    this.element = $(element);
    if (!this.element) { return false; }

    this.stateSwitcher;
    this.currentState = '_';
    this.determine = 'normal';
    this.bounded = !!boundingElement;
    this.parent = !boundingElement ? this.element.parentNode : $(boundingElement);

    // determine initial state
    if (this.element.getBoundingClientRect().top < 1) {
      this.setState('sticky');
      this.stateSwitcher();
    } else {
      this.setState('normal');
    }

    // window.addEventListener('scroll', this.stateSwitcher.bind(this));    // stateSwitcher changes, so cannot pass (ie. bind directly) like this
    window.addEventListener('scroll', () => { this.stateSwitcher(); });
    window.addEventListener('resize', () => { this.stateSwitcher(); });
  }

  normal() {
    const elementPosition = this.element.getBoundingClientRect();
    if (elementPosition.top < 1) {
      return this.setState('sticky');
    }
  }

  sticky() {
    const parentPosition = this.parent.getBoundingClientRect();
    if (parentPosition.top > 1) {
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
    if (elementPosition.top > 1) {
      return this.setState('sticky');
    }
  }

  setState(state) {
    if (this.currentState === state) { return; }
    this.element.classList.remove(this.currentState);
    this.element.classList.add(state);
    this.currentState = state;
    this.stateSwitcher = this[state];   // stateSwitcher will point at an internal fn
  }
}
