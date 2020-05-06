editor.document.designMode = "On";
window.onload = function () {
  let head  = editor.document.getElementsByTagName('head')[0];
  let link  = editor.document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = 'prism/prism.css';
  head.appendChild(link);

  let body  = editor.document.getElementsByTagName('body')[0];
  let script  = editor.document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'prism/prism.js';
  body.appendChild(script);

  body.style.fontFamily = "Segoe UI";
  
  const dropdownStyle = new DropDown(document.querySelector("#style-button"));
  dropdownStyle.init();
  
  const dropdownFont = new DropDown(document.querySelector("#font-button"));
  dropdownFont.init();

  document.querySelector('body').addEventListener('click', (e) =>{
    if(e.target != dropdownStyle.element) dropdownStyle.hide();
    if(e.target != dropdownFont.element) dropdownFont.hide();
  })
}

function transform(option, argument) {
  editor.document.execCommand(option, false, argument);
}

function onCreateLinkClick(){
  var link = window.prompt('Enter link URL'); 
  transform('createLink',link);
}

function onCodeBlockClick(){
  let parent = editor.document.getSelection().focusNode.parentElement;
  if(parent.tagName != 'BODY') return;
  let codeBlock = editor.document.createElement('pre');
  let subCodeBlock = editor.document.createElement('code');
  codeBlock.appendChild(subCodeBlock);
  codeBlock.classList.add('language-css');
  parent.appendChild(codeBlock);
}

class DropDown{
  constructor(element){
    this.element = element;
    this.listDiv = document.createElement('div');
  }

  init(){
    const content = document.querySelector(`#${this.element.id} .dropdown-content`);
    const children = document.querySelectorAll(`#${this.element.id} .dropdown-item`);
    children.forEach((child) =>{
      const originalOnClick = child.onclick;
      child.addEventListener('click', () =>{
        originalOnClick();
        this.element.childNodes[0].nodeValue = child.innerText;
      }) 
    })

    this.element.removeChild(content);
    this.listDiv.classList.add('dropdown-div');
    this.listDiv.appendChild(content);
    this.element.appendChild(this.listDiv);

    this.element.addEventListener('click', (e) =>{
      if(e.target != this.element && e.target.tagName != "svg" && e.target.tagName != "path") return;
      this.listDiv.classList.toggle('active');
    })

    this.listDiv.addEventListener('click', () =>{
      this.listDiv.classList.remove('active');
    })
  }

  hide(){
    this.listDiv.classList.remove('active');
  }
}