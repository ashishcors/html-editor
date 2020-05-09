//enable html design mode for editor
editor.document.designMode = "On";

//declare dropdowns
let styleDropdown, fontDropdown, emojiDropdown;

//to maintain active option state
let activeProperties = {
  bold: false,
  italic: false,
  strikeThrough: false,
  underline: false,
  insertOrderedList: false,
  insertUnorderedList: false,
  codeBlock: false,
};

//initialize everything when the window loads
window.onload = function () {
  //since the editor is an iframe, it doesn't contain any script or css.
  //following code add prism.css & editor.css to the editor
  let head = editor.document.getElementsByTagName('head')[0];
  let prismCss = editor.document.createElement('link');
  prismCss.rel = 'stylesheet';
  prismCss.type = 'text/css';
  prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/themes/prism.min.css';
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
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/prism.min.js';
  body.appendChild(script);

  //set the default fontName of the editor to Verdana
  transform('fontName', 'Verdana');

  //initializes the dropdown for text-style button
  styleDropdown = new Dropdown(document.querySelector("#btn-style"), intialValue = 'Normal');
  styleDropdown.init();

  //initializes the dropdown for font-family button 
  fontDropdown = new Dropdown(document.querySelector("#btn-font"), intialValue = 'Verdana');
  fontDropdown.init();

  //initializes the dropdown for emoji button 
  emojiDropdown = new EmojiDropdown(document.querySelector("#btn-emoji"));
  emojiDropdown.init((emoji) => {
    //to append emoji at end of current text
    //more on selection & range at: https://javascript.info/selection-range#selection-events
    editor.document.body.focus();
    let selection = editor.window.getSelection();
    let range = selection.getRangeAt(0);
    let selectedText = range.extractContents();
    selectedText.append(emoji);
    range.insertNode(selectedText);
    range.collapse();
  });

  //to hide the dropdowns of the use clicks on outside the dropdown
  document.querySelector('body').addEventListener('click', (e) => {
    if (e.target != styleDropdown.element) styleDropdown.hide();
    if (e.target != fontDropdown.element) fontDropdown.hide();
    if (e.target != emojiDropdown.element && !emojiDropdown.element.contains(e.target))
      emojiDropdown.hide();
  });

  //listen to all change events on editor to change properties accordingly
  addMultipleEventListener(editor.document.body, ['keydown', 'click', 'focus'], () => {
    onEditorChange();
  });
}

//whenever anything changes on editor this should be called
function onEditorChange() {
  //TODO:add debounce to this
  let currentElement = editor.window.getSelection().getRangeAt(0).commonAncestorContainer;
  if (currentElement.tagName == 'BODY') return;
  activeProperties.bold = isDescendantOf(currentElement, 'B');
  activeProperties.italic = isDescendantOf(currentElement, 'I');
  activeProperties.strikeThrough = isDescendantOf(currentElement, 'STRIKE');
  activeProperties.underline = isDescendantOf(currentElement, 'U');
  activeProperties.insertOrderedList = isDescendantOf(currentElement, 'OL');
  activeProperties.insertUnorderedList = isDescendantOf(currentElement, 'UL');
  activeProperties.codeBlock = isDescendantOf(currentElement, 'PRE');
  updateOptionsState();
  hideAllDropdown();
}

//update the UI base on activeProperties
function updateOptionsState() {
  setElementActiveState(document.querySelector('#btn-bold'), activeProperties.bold);
  setElementActiveState(document.querySelector('#btn-italic'), activeProperties.italic);
  setElementActiveState(document.querySelector('#btn-strikethrough'), activeProperties.strikeThrough);
  setElementActiveState(document.querySelector('#btn-underline'), activeProperties.underline);
  setElementActiveState(document.querySelector('#btn-ordered-list'), activeProperties.insertOrderedList);
  setElementActiveState(document.querySelector('#btn-unordered-list'), activeProperties.insertUnorderedList);
  setElementActiveState(document.querySelector('#btn-code-block'), activeProperties.codeBlock);
}

function setElementActiveState(element, isActive) {
  if (isActive) element.classList.add('active');
  else element.classList.remove('active');
}

function hideAllDropdown() {
  styleDropdown.hide();
  fontDropdown.hide();
  emojiDropdown.hide();
}

//to execute commands on editor
function transform(option, argument) {
  editor.document.body.focus();
  editor.document.execCommand(option, false, argument);
}

function onOptionClick(element, option) {
  transform(option, null);
  setElementActiveState(element, activeProperties[option] = !activeProperties[option]);
}

function onCreateLinkClick() {
  var link = window.prompt('Enter link URL');
  if (link != null) transform('createLink', link);
}

function onInsertImageClick() {
  var link = window.prompt('Enter image URL');
  if (link != null) transform('insertImage', link);
}

function onAddCodeBlockClick(element) {
  //get current selection & range
  //more on selection & range at: https://javascript.info/selection-range#selection-events
  let selection = editor.window.getSelection();
  let range = selection.getRangeAt(0);

  //code tag needs to be inside pre tag
  //both tags need to have language class
  //selected text should be inside code tag
  console.log(range.commonAncestorContainer);

  //create pre tag and code tag and add content to code tag, add css
  if (!isDescendantOf(range.commonAncestorContainer, 'PRE')) {
    let preTag = editor.document.createElement('pre');
    let codeTag = editor.document.createElement('code');
    let selectedText = range.extractContents();
    codeTag.classList.add('language-css');
    preTag.classList.add('language-css');
    codeTag.appendChild(selectedText);
    preTag.appendChild(codeTag);
    range.insertNode(editor.document.createElement('br'));
    range.insertNode(preTag);
    setElementActiveState(element, true);
  }
  //TODO: fix issue - when a empty code block is created the code is entered inside pre tag not code tag
}
