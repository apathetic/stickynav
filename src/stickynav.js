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


let handle;
let sections;
let items = [];
let isScrolling = false;
let currentSection = null;
let ticking = false;


export default (options={}) => {
  const offset = options.offset || 0;
  const bounded = options.boundedBy || false;

  handle = document.querySelector(options.nav);
  sections = options.sections || document.querySelectorAll('[data-nav]');

  if (!sections || !handle) { console.log('StickyNav: missing nav or nav sections.'); return false; }

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
  const nav = handle.querySelector('ul');

  Array.prototype.forEach.call(sections, (section) => {
    const title = section.getAttribute('data-nav');
    const id = section.id || '';
    const item = document.createElement('li');

    item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
    item.addEventListener('click', (e) => {
      items.forEach((i) => { i.className = ''; });
      item.classList.add('active');

      isScrolling = true;
      scrollPage(section, 0, () => { isScrolling = false });
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
  let i = sections.length;

  // Find i. Start at end and work back
  for (i; i--;) {
    if (~~sections[i].getBoundingClientRect().top <= 0) {    // note: ~~ is Math.floor
      break;
    }
  }

  // Add active class to currentSection, or remove if nothing is currently active
  if (i !== currentSection) {
    items.forEach((item) => { item.classList.remove('active'); });
    sections.forEach(function (section) { section.classList.remove('active'); });

    if (i >= 0) {
      items[i].classList.add('active');
      sections[i].classList.add('active');
    }
    currentSection = i;
  }

  ticking = false;
}
