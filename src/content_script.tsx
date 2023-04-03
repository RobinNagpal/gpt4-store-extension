import React from 'react';
import ReactDOM from 'react-dom';
import { FrameContents } from './frame_contents';
import Frame from './frame/frame';

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

  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .capture-highlighter {
      border: 4px solid yellow !important;
      z-index: 9999;
    }
  `;
  document.getElementsByTagName('head')[0].appendChild(styleElement);

  document.body.appendChild(root);

  const App = (
    <Frame>
      <FrameContents />
    </Frame>
  );

  ReactDOM.render(App, root);
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  const elementsByClassName = document.getElementsByClassName(
    'capture-highlighter',
  );

  for (let i = 0; i < elementsByClassName.length; i++) {}

  chrome.tabs.create({
    url:
      'http://www.google.com/search?q=' +
      encodeURIComponent(info.selectionText),
  });
});
