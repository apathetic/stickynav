(function (exports) {
  'use strict';

  /**
   * Custom Event Polyfill
   * reference: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
   * @return {[type]} [description]
   */
  function _customEvent() {
    if (typeof window.CustomEvent === 'function') { return false; }

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }


  // /**
  //  * Object Assign Polyfill
  //  * reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  //  * @return {[type]} [description]
  //  */
  // function _objectAssign() {
  //   if (typeof Object.assign != 'function') {
  //     // Must be writable: true, enumerable: false, configurable: true
  //     Object.defineProperty(Object, 'assign', {
  //       value: function assign(target, varArgs) { // .length of function is 2
  //         // 'use strict';
  //         if (target == null) { // TypeError if undefined or null
  //           throw new TypeError('Cannot convert undefined or null to object');
  //         }

  //         var to = Object(target);

  //         for (var index = 1; index < arguments.length; index++) {
  //           var nextSource = arguments[index];

  //           if (nextSource != null) { // Skip over if undefined or null
  //             for (var nextKey in nextSource) {
  //               // Avoid bugs when hasOwnProperty is shadowed
  //               if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
  //                 to[nextKey] = nextSource[nextKey];
  //               }
  //             }
  //           }
  //         }
  //         return to;
  //       },
  //       writable: true,
  //       configurable: true
  //     });
  //   }
  // }



  function polyfill() {
    _customEvent();
    // _objectAssign();
  }

  polyfill();


  // mini querySelector helper fn
  function $(el) {
    return el instanceof HTMLElement ? el : document.querySelector(el);
  }

  // Sticky element default options
  var defaults = {
    offset: 0,
    boundedBy: false //  Defaults to the parent, but can be any element in the page.
  }

  // Sticky Event
  var stickyEvent = new CustomEvent('sticky', {
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
  var Sticky = function Sticky(element, options) {
    var this$1 = this;

    this.element = $(element);

    if (!this.element) { return false; }

    // this.opts = Object.assign({}, defaults, options);
    this.opts = {};
    for (var opt in defaults) { this$1.opts[opt] = defaults[opt]; }
    for (var opt$1 in options) { this$1.opts[opt$1] = options[opt$1]; }

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

    window.addEventListener('scroll', function () { this$1.stateSwitcher(); });
    window.addEventListener('resize', function () { this$1.stateSwitcher(); });
  };

  Sticky.prototype.normal = function normal () {
    var elementPosition = this.element.getBoundingClientRect();
    if (elementPosition.top < this.opts.offset) {
      return this.setState('sticky');
    }
  };

  Sticky.prototype.sticky = function sticky () {
    var parentPosition = this.parent.getBoundingClientRect();
    if (parentPosition.top > this.opts.offset) {
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
    if (elementPosition.top > this.opts.offset) {
      return this.setState('sticky');
    }
  };

  Sticky.prototype.setState = function setState (state) {
    if (this.currentState === state) { return; }
    this.element.classList.remove(this.currentState);
    this.element.classList.add(state);
    this.currentState = state;
    this.stateSwitcher = this[state]; // stateSwitcher will point at an internal fn

    if (state === 'sticky') {
      this.element.dispatchEvent(stickyEvent); // , { detail: state });
    }
  };

  function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t + b; }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  /**
   * Scroll the page to a particular page anchor
   * @param {HTMLElement} to The element to scroll to.
   * @param {number} offset A scrolling offset.
   * @param {function} callback Function to apply after scrolling
   * @return {void}
   */
  function scrollPage(to, offset, callback) {
    if ( offset === void 0 ) offset = 0;

    var startTime;
    var duration = 500;
    var startPos = window.pageYOffset;
    var endPos = ~~(to.getBoundingClientRect().top - offset);
    var scroll = function (timestamp) {
      var elapsed;

      startTime = startTime || timestamp;
      elapsed = timestamp - startTime;

      document.body.scrollTop = document.documentElement.scrollTop = easeInOutCubic(elapsed, startPos, endPos, duration);

      if (elapsed < duration) {
        requestAnimationFrame(scroll);
      } else if (callback) {
        callback.call(to);
      }
    };

    requestAnimationFrame(scroll);
  }

  // mini querySelectorAll helper fn
  function $$(els) {
    return els instanceof NodeList ? Array.prototype.slice.call(els) :
           els instanceof HTMLElement ? [els] :
           typeof els === 'string' ? Array.prototype.slice.call(document.querySelectorAll(els)) :
           [];
  }

  var Stickynav = function Stickynav(options) {
    if ( options === void 0 ) options={};

    this.handle = $$(options.nav)[0];
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
  };

  /**
   * Generate the nav <li>'s and setup the Event Listeners
   * @return {void}
   */
  Stickynav.prototype.generate = function generate () {
      var this$1 = this;

    var nav = this.handle.querySelector('ul');

    Array.prototype.forEach.call(this.sections, function (section) {
      var title = section.getAttribute('data-nav');
      var id = section.id || '';
      var item = document.createElement('li');

      item.innerHTML = '<a href="#'+id+'">'+ title + '</a>';
      item.addEventListener('click', function (e) {
        this$1.items.forEach(function (i) { i.className = ''; });
        item.classList.add('active');
        this$1.isScrolling = true;
        scrollPage(section, this$1.offset, function () { this$1.isScrolling = false });
      });

      this$1.items.push(item);
      nav.appendChild(item);
    });
  };

  /**
   * Update the active nav item on window.scroll. This decouples it from scroll events
   * @return {void}
   */
  Stickynav.prototype.updateActiveItem = function updateActiveItem () {
    if (!this.ticking && !this.isScrolling) {
      this.ticking = true;
      window.requestAnimationFrame(this.checkSectionPosition.bind(this));
    }
  };

  /**
   * Check each section's getBoundingClientRect to determine which is active
   * @return {void}
   */
  Stickynav.prototype.checkSectionPosition = function checkSectionPosition () {
      var this$1 = this;

    var i = this.sections.length;

    // Find i. Start at end and work back
    for (i; i--;) {
      if (~~this$1.sections[i].getBoundingClientRect().top <= this$1.offset) {// note: ~~ is Math.floor
        break;
      }
    }

    // Add active class to currentSection, or remove if nothing is currently active
    if (i !== this.currentSection) {
      this.items.forEach(function (item) { item.classList.remove('active'); });
      this.sections.forEach(function (section) { section.classList.remove('active'); });

      if (i >= 0) {
        this.items[i].classList.add('active');
        this.sections[i].classList.add('active');
      }

      this.currentSection = i;
    }

    this.ticking = false;
  };

  exports.StickyNav = Stickynav;
  exports.Sticky = Sticky;
  exports.Scroll = scrollPage;

}((this.window = this.window || {})));