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
    sendResponse(document.all[0].outerHTML);
  }
});
