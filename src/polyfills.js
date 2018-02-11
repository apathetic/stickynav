
/**
 * Custom Event Polyfill
 * reference: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 * @return {[type]} [description]
 */
function customEvent() {
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


export default function() {
  customEvent();
}
