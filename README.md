# Sticky Nav

A simple navigation bar that efficiently attaches / detaches to the top of the viewport upon scrolling

## Introduction

...


## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://stash.hugeinc.com/projects/BOWER/repos/stickynav/browse/dist/stickynav.min.js?at=b524c3b74362a516cca1d7c3cde1be7e508480e3&raw
[max]: https://github.com/apathetic/stickynav/blob/master/dist/stickynav.js

### ES6
```javascript
import { stickyElement, stickyNav } from '../src/stickynav.es6.js';
```

### CommonJS
```javascript
var stickyElement = require('../src/stickynav.es6.js').stickyElement;
var stickyNav = require('../src/stickynav.es6.js').stickyNav;
```

### AMD
```javascript
require(['stickyElement', 'stickyNav'], function(stickyElement, stickyNav){
	// ...
})
```

### Browser

```html
<script src="path/to/stickyNav.js"></script>
<script>
	new stickyNav({
		nav: '#sticky',
		boundedBy: 'main'
	});
</script>
```

## Documentation

...

## Support
* IE8+
* Safari / Chrome
* Firefox
* iOS
* Android

## Known Issues

## Examples

Please see the _test / demo_ directory

## Release History

### 0.3
* Breaking change: updating ```bounded``` to ```boundedBy```
* Better treatment of bounding element

### 0.1
* initial commit
