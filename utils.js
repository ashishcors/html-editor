//check id if the element is child of particular parent
function isDescendantOf(element, tag) {
  while (element = element.parentNode) {
    if (element.tagName == tag) return true;
  }
  return false;
}


//register multiple eventlisteners on an element
function addMultipleEventListener(element, events, onEventCallback) {
  events.forEach((event) => {
    element.addEventListener(event, () => {
      onEventCallback();
    });
  });
}