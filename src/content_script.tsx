import React from 'react';
import ReactDOM from 'react-dom';
import CaptureButton from './components/capture_button';
import Frame from './components/frame';
import IndexDropdown from './components/index_dropdown';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log('Receive color = ' + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse('Change color to ' + msg.color);
  } else {
    sendResponse('Color message is none.');
  }
});

// https://github.com/MariusBongarts/medium-highlighter/blob/master/src/content_script.ts

if (Frame.isReady()) {
  Frame.toggle();
} else {
  boot();
}

function boot() {
  const root = document.createElement('div');
  root.id = 'capture-root-node';

  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .capture-highlighter {
      border: 4px solid red !important;
      z-index: 9999;
    }
  `;
  document.getElementsByTagName('head')[0].appendChild(styleElement);

  document.body.appendChild(root);

  const App = (
    <Frame>
      <IndexDropdown />
      <CaptureButton />
    </Frame>
  );

  ReactDOM.render(App, root);
}

// read message from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('onMessage', request, sender, sendResponse);
  if (request.action == 'right_menu_clicked') {
    console.log('right_menu_clicked', request);
    const elementsByClassName = document.getElementsByClassName(
      'capture-highlighter',
    );
    if (elementsByClassName.length > 0) {
      const xpath = getXPath(elementsByClassName[0]);
      console.log('xpath', xpath);
      console.log('element', getElementByXpath(xpath));

      sendResponse({ url: request.url, xpath: xpath });
    }
  }
});

// https://stackoverflow.com/a/9198430/440432
function getXPath(node) {
  var comp,
    comps = [];
  var parent = null;
  var xpath = '';
  var getPos = function (node) {
    var position = 1,
      curNode;
    if (node.nodeType == Node.ATTRIBUTE_NODE) {
      return null;
    }
    for (
      curNode = node.previousSibling;
      curNode;
      curNode = curNode.previousSibling
    ) {
      if (curNode.nodeName == node.nodeName) {
        ++position;
      }
    }
    return position;
  };

  if (node instanceof Document) {
    return '/';
  }

  for (
    ;
    node && !(node instanceof Document);
    node =
      node.nodeType == Node.ATTRIBUTE_NODE ? node.ownerElement : node.parentNode
  ) {
    comp = comps[comps.length] = {};
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        comp.name = 'text()';
        break;
      case Node.ATTRIBUTE_NODE:
        comp.name = '@' + node.nodeName;
        break;
      case Node.PROCESSING_INSTRUCTION_NODE:
        comp.name = 'processing-instruction()';
        break;
      case Node.COMMENT_NODE:
        comp.name = 'comment()';
        break;
      case Node.ELEMENT_NODE:
        comp.name = node.nodeName;
        break;
    }
    comp.position = getPos(node);
  }

  for (var i = comps.length - 1; i >= 0; i--) {
    comp = comps[i];
    xpath += '/' + comp.name;
    if (comp.position != null) {
      xpath += '[' + comp.position + ']';
    }
  }

  return xpath;
}

// https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript#document.evaluate
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
}
