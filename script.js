editor.document.designMode = "On";

function transform(option, argument) {
  editor.document.execCommand(option, false, argument);
}

function onCreateLinkClick(){
  var link = window.prompt('Enter link URL'); 
  transform('createLink',link);
}

function onCodeBlockClick(){
  let codeBlock = editor.document.createElement('pre');
  let subCodeBlock = editor.document.createElement('code');
  codeBlock.appendChild(subCodeBlock);
  codeBlock.classList.add('language-css');
}

// window.onload = function () {
//   let btnCode = document.querySelector('#btn-code');
//   btnCode.addEventListener('click', function(){
    
//   })
// }