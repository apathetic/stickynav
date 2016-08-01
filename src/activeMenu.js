/*
 * sticky nav
 * https://github.com/apathetic/stickynav
 *
 * Copyright (c) 2013, 2016 Wes Hatch
 * Licensed under the MIT license.
 *
 */

import ScrollPage from '@apatheticwes/scrollify';

let handle;
let sections;
let items = [];
let isScrolling = false;
let currentSection = null;
let ticking = false;


/**
 * Generate the nav <li>'s and setup the Event Listeners
 * @return {void}
 */
export function generate(handle, sections) {
  const nav = handle.querySelector('ul');

  Array.from(sections, (section) => {
    const title = section.getAttribute('data-nav');
    const id = section.id || '';
    const item = document.createElement('li');

    item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
    item.addEventListener('click', (e) => {
      e.preventDefault();
      items.forEach((i) => { i.className = ''; });
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
export function updateActiveItem() {
  if (!ticking && !isScrolling) {
    ticking = true;
    window.requestAnimationFrame(checkSectionPosition);
  }
}


/**
 * Check each section's getBoundingClientRect to determine which is active
 * @return {void}
 */
export function checkSectionPosition() {
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
    if (i >= 0) {
      items[i].classList.add('active');
    }
    currentSection = i;
  }

  ticking = false;
}
