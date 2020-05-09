class Dropdown {
  constructor(element) {
    this.element = element;
    //creates an empty div element
    this.listDiv = document.createElement('div');
  }
  init() {
    //grab the content of the dropdown
    const content = document.querySelector(`#${this.element.id} .dropdown-content`);
    //grab all the childen/items/options of the dropdown
    const children = document.querySelectorAll(`#${this.element.id} .dropdown-item`);
    children.forEach((child) => {
      const originalOnClick = child.onclick;
      child.addEventListener('click', () => {
        //sets the button text
        console.log(child.textContent);
        this.element.childNodes[0].nodeValue = child.textContent;
        //fires the oroginal on click attribute
        originalOnClick();
      });
    });
    //remove the content from element
    this.element.removeChild(content);
    //apply css
    this.listDiv.classList.add('dropdown-div');
    //append to respective parents
    this.listDiv.appendChild(content);
    this.element.appendChild(this.listDiv);
    this.element.addEventListener('click', (e) => {
      //this is done to prevent listening to click from the dropdown content/items
      if (e.target != this.element && e.target.tagName != "svg" && e.target.tagName != "path")
        return;
      this.listDiv.classList.toggle('active');
    });
  }
  hide() {
    this.listDiv.classList.remove('active');
  }
}
