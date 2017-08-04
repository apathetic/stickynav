
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


/**
 * Object Assign Polyfill
 * reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @return {[type]} [description]
 */
function _objectAssign() {
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target, varArgs) { // .length of function is 2
        // 'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
}



export default function() {
  _customEvent();
  _objectAssign();
}
