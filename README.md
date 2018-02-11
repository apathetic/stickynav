# Sticky Nav
[![NPM Version](https://img.shields.io/npm/v/@apatheticwes/stickynav.svg?style=flat-square)](https://www.npmjs.com/package/@apatheticwes/stickynav)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://raw.githubusercontent.com/apathetic/stick/master/LICENSE)

> A package of "Sticky Navigation" utilities

## Introduction

A collection of 3 mini-utilities: a "sticky" Class to affix elements to the top of the viewport when scrolled, a function to smoothly scroll the page to any anchor, and a Class that auto-generates an in-page navigation from data-attribues in the DOM.  

`Scroll` and `Sticky` may be used individually, but when used in tandem via `StickyNav` the result is an automatically created navigation menu that sticks to the top of the viewport, with nav-items that smoothly scroll to corresponding anchors in the page.

## Installation

If you're oldskool, you can download the [pre-built version](https://github.com/apathetic/stickynav/blob/master/dist/stickynav.js
) to quickly mess around. Otherwise:

`npm i @apatheticwes/stickynav -D`

### ES6
```javascript
import { Sticky, Scroll, StickyNav } from 'stickynav';
```

### CommonJS
```javascript
var sticky = require('stickynav').Sticky;
var stickynav = require('stickynav').StickyNav;
var scroll = require('stickynav').Scroll;
```

## Recipes

Create an auto-generated sticky navigation from in-page DOM elements:

```html
<!-- this will become a sticky navigation, populated with nav items that initiate smooth scrolling when clicked -->
<ul id="sticky"></ul> 

...

<main>
  <section data-nav="Introduction">
  <section data-nav="Overview">
  <section data-nav="Summary">
</main>
```

```javascript
new stickyNav({
  nav: '#sticky'
});
```

Or, just create a sticky element. This one is bounded by its parent (meaning it will unstick along with the bottom edge of its parent), and will become sticky 80px from the top of the viewport:

```javascript
new Sticky('#sticky', {
  boundedBy: true,
  offset: 80
}
```

Smoothly scroll to a particular page section or anchor:

```javascript
const intro = document.querySelector('#intro');

scrollPage(intro);
```

## Options
### Sticky

| name             | type                 | default | description |
| ---------------- | -------------------- | ------- | ----------- |
| element          | HTMLElement          |         | The element to sticky-ify (required). |
| option.boundedBy | boolean, HTMLElement |         | "true" to use the parent node, or a custom bounding element for the sticky element. This affects where / when the sticky will attach and detach | 
| option.offset    | number               | 0         | An offset from the top at which to toggle "stickiness" | 

### Scroll
| name       | type        | default | description                                  |
| ---------- | ----------- | ------- | -------------------------------------------- |
| to         | HTMLElement |         | The DOM node to scroll to (required)         |
| offset     | number      | 0       | A scrolling offset                           | 
| callback   | function    |         | Callback function when scrolling is complete | 

### StickyNav
| name             | type                 | default  | description                                  |
| ---------------- | -------------------- | -------- | -------------------------------------------- |
| option.nav       | HTMLElement          |          | The DOM node to generate the nav into (required)|
| option.sections  | string, HTMLElement  | data-nav | A querySelector, or the elements themselves, to be used when generating the menu items in the navigation | 
| option.boundedBy | boolean, HTMLElement | false    | "true" to use the parent node, or a custom bounding element for the sticky element. This affects where / when the sticky will attach and detach | 
| option.offset    | number               | 0        | The scroll / sticky offset | 


## Examples

There is a [demo](https://apathetic.github.io/showcase/components/stickynav/) is available. Alternatively, after cloning the repo, try:

```
npm i
npm start
```

A server will spin up at ```http://localhost:8080```, where you may play with the various examples.

## Support
* IE8+
* Safari / Chrome
* Firefox
* iOS
* Android

## License
MIT