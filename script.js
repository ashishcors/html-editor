//enable html design mode for editor
editor.document.designMode = "On";

//initialize everything went the window loads
window.onload = function () {
  //since the editor is an iframe, it doesn't contain any script or css.
  //following code add prism.css to the editor
  let head = editor.document.getElementsByTagName('head')[0];
  let prismCss = editor.document.createElement('link');
  prismCss.rel = 'stylesheet';
  prismCss.type = 'text/css';
  prismCss.href = 'prism/prism.css';
  head.appendChild(prismCss);
  let editorCss = editor.document.createElement('link');
  editorCss.rel = 'stylesheet';
  editorCss.type = 'text/css';
  editorCss.href = 'editor/editor.css';
  head.appendChild(editorCss);

  //following code add prism.js to editor
  let body = editor.document.getElementsByTagName('body')[0];
  let script = editor.document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'prism/prism.js';
  body.appendChild(script);

  //set the default of the editor to Verdana
  body.style.fontFamily = "Verdana";

  //initializes the dropdown for text-style button
  const dropdownStyle = new DropDown(document.querySelector("#style-button"));
  dropdownStyle.init();

  //initializes the dropdown for font-family button 
  const dropdownFont = new DropDown(document.querySelector("#font-button"));
  dropdownFont.init();

  //initializes the dropdown for emoji button 
  const dropdownEmoji = new EmojiDropDown(document.querySelector("#emoji-button"));
  dropdownEmoji.init((emoji) =>{this.console.log(emoji)});

  //to hide the dropdowns of the use clicks on outside the dropdown
  //TODO:The dropdown doesn't hides when clicked on editor area.
  document.querySelector('body').addEventListener('click', (e) => {
    if (e.target != dropdownStyle.element) dropdownStyle.hide();
    if (e.target != dropdownFont.element) dropdownFont.hide();
    if (e.target != dropdownEmoji.element) dropdownEmoji.hide();
  })

  //for binding editor title with title input field.
  // const title = "Some title";
  // let inputTitle = document.querySelector('#title');
  // inputTitle.value = title;
  // let editorTitle = editor.document.createElement('font');
  // editorTitle.setAttribute('size','7');
  // editor.document.body.prepend(editorTitle);
  // editorTitle.textContent = title;

  // inputTitle.addEventListener('input', () => {
  //   editorTitle.textContent = inputTitle.value;
  // });

  // inputTitle.addEventListener('change', () => {
  //   // editorTitle.textContent = inputTitle.value;
  //   console.log();
  // });
}

//to execute commands on editor
function transform(option, argument) {
  editor.document.execCommand(option, false, argument);
}


function onCreateLinkClick() {
  var link = window.prompt('Enter link URL');
  if(link != null) transform('createLink', link);
}

function onInsertImageClick(){
  var link = window.prompt('Enter image URL');
  if(link != null) transform('insertImage', link);
}

function onAddCodeBlockClick() {
  let parent = editor.document.getSelection().focusNode.parentElement;

  //if we don't do this the tag gets attached to the main content, not the editor
  if (parent.tagName != 'BODY') return;

  //get current selection & range
  let selection = editor.window.getSelection();
  let range = selection.getRangeAt(0);
  let selectedText = range.extractContents();

  //code tag needs to be inside pre tag
  //both tags need to have language class
  //selected text should be inside code tag

  //create pre tag and code tag and add content to code tag, add css
  let preTag = editor.document.createElement('pre');
  let codeTag = editor.document.createElement('code');
  codeTag.classList.add('language-css');
  codeTag.appendChild(selectedText);
  preTag.appendChild(codeTag);
  preTag.classList.add('language-css');
  range.insertNode(preTag);

  //TODO: fix issue - when a empty code block is created the code is entered inside pre tag not code tag
}

// ----------------------------------- Dropdown starts ---------------------------------------------//
class DropDown {
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
        //fires the oroginal on click attribute
        originalOnClick();

        //sets the button text
        this.element.childNodes[0].nodeValue = child.innerText;
      })
    })

    //remove the content from element
    this.element.removeChild(content);

    //apply css
    this.listDiv.classList.add('dropdown-div');

    //append to respective parents
    this.listDiv.appendChild(content);
    this.element.appendChild(this.listDiv);


    this.element.addEventListener('click', (e) => {
      //this is done to prevent listening to click from the dropdown content/items
      if (e.target != this.element && e.target.tagName != "svg" && e.target.tagName != "path") return;

      this.listDiv.classList.toggle('active');
    })

    this.listDiv.addEventListener('click', () => {
      this.hide();
    })
  }

  hide() {
    this.listDiv.classList.remove('active');
  }
}
// ------------------------------------ Dropdown ends --------------------------------------------//

// -------------------------------- Emoji Dropdown starts ---------------------------------------//


class EmojiDropDown{
  constructor(element) {
    this.element = element;
    this.listDiv = document.createElement('div');
  }

  init(onEmojiSelected){
    this.listDiv.classList.add('emoji-dropdown-div');
    let faceEmojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
    faceEmojis.forEach((e) =>{
      let emoji = document.createElement('p');
      emoji.classList.add('emoji-dropdown-item');
      emoji.style.float = 'left';
      emoji.textContent = e;
      emoji.addEventListener('click', () =>{
        onEmojiSelected(e);
        this.hide();
      });
      this.listDiv.appendChild(emoji);
    });


    this.element.appendChild(this.listDiv);
    
    this.element.addEventListener('click', (e) => {
      //this is done to prevent listening to click from the dropdown content/items
      if (e.target != this.element) return;

      this.listDiv.classList.toggle('active');
    })

    this.listDiv.addEventListener('click', () => {
      this.hide();
    })
  }

  hide() {
    this.listDiv.classList.remove('active');
  }
}
// -------------------------------- Emoji Dropdown ends --------------------------------------//
