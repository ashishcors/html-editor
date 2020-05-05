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

// window.onload = function () {
//   let btnCode = document.querySelector('#btn-code');
//   btnCode.addEventListener('click', function(){
    
//   })
// }