/*
 * sticky nav
 * https://github.com/apathetic/stickynav
 *
 * Copyright (c) 2013, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */

import Sticky from './sticky.js';
import scrollPage from './scrollPage.js';

// mini querySelectorAll helper fn
function $$(els) {
  return els instanceof NodeList ? Array.prototype.slice.call(els) :
         typeof els === 'string' ? Array.prototype.slice.call(document.querySelectorAll(els)) :
         [];
}

export default class Stickynav {

  constructor(options={}) {
    this.handle = document.querySelector(options.nav);
    this.sections = $$(options.sections || document.querySelectorAll('[data-nav]'));

    if (!this.sections || !this.handle) { console.log('StickyNav: missing nav or nav sections.'); return false; }

    this.items = [];
    this.isScrolling = false;
    this.currentSection = null;
    this.ticking = false;
    this.offset = options.offset || 0;

    new Sticky(this.handle, {
      boundedBy: options.boundedBy || false,
      offset: this.offset
    });

    this.generate();
    this.checkSectionPosition();

    window.addEventListener('scroll', this.updateActiveItem.bind(this));
  }

  /**
   * Generate the nav <li>'s and setup the Event Listeners
   * @return {void}
   */
  generate() {
    const nav = this.handle.querySelector('ul');

    Array.prototype.forEach.call(this.sections, (section) => {
      const title = section.getAttribute('data-nav');
      const id = section.id || '';
      const item = document.createElement('li');

      item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
      item.addEventListener('click', (e) => {
        this.items.forEach((i) => { i.className = ''; });
        item.classList.add('active');
        this.isScrolling = true;
        scrollPage(section, 0, () => { this.isScrolling = false });
      });

      this.items.push(item);
      nav.appendChild(item);
    });
  }

  /**
   * Update the active nav item on window.scroll. This decouples it from scroll events
   * @return {void}
   */
  updateActiveItem() {
    if (!this.ticking && !this.isScrolling) {
      this.ticking = true;
      window.requestAnimationFrame(this.checkSectionPosition.bind(this));
    }
  }

  /**
   * Check each section's getBoundingClientRect to determine which is active
   * @return {void}
   */
  checkSectionPosition() {
    let i = this.sections.length;

    // Find i. Start at end and work back
    for (i; i--;) {
      if (~~this.sections[i].getBoundingClientRect().top <= this.offset) {  // note: ~~ is Math.floor
        break;
      }
    }

    // Add active class to currentSection, or remove if nothing is currently active
    if (i !== this.currentSection) {
      this.items.forEach((item) => { item.classList.remove('active'); });
      this.sections.forEach((section) => { section.classList.remove('active'); });

      if (i >= 0) {
        this.items[i].classList.add('active');
        this.sections[i].classList.add('active');
      }

      this.currentSection = i;
    }

    this.ticking = false;
  }
}
