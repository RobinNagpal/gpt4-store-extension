import React from 'react';
import ReactDOM from 'react-dom';
import { getElementByXpath, getXPath } from './utils/xpaths';
import CaptureButton from './components/capture_button';
import Frame from './components/frame';
import IndexDropdown from './components/index_dropdown';

// https://github.com/MariusBongarts/medium-highlighter/blob/master/src/content_script.ts
if (Frame.isReady()) {
  Frame.toggle();
} else {
  boot();
}

function boot() {
  const captureGlobal: any = {};

  const root = document.createElement('div');
  root.id = 'capture-root-node';

  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .capture-highlighter {
      border: 4px solid red !important;
    }
    .already-captured-highlighter {
      border: 4px solid red !important;
    }
  `;
  document.getElementsByTagName('head')[0].appendChild(styleElement);

  document.body.appendChild(root);

  const App = (
    <Frame>
      <IndexDropdown />
      <CaptureButton captureGlobal={captureGlobal} />
    </Frame>
  );

  ReactDOM.render(App, root);

  //content script
  var clickedEl = null;

  document.addEventListener(
    'contextmenu',
    function (event: MouseEvent) {
      clickedEl = event.target;
      console.log('stop capturing callback');
      if (clickedEl && captureGlobal.stopCapturingCallback) {
        console.log('stop capturing callback in contextmenu');
        captureGlobal.stopCapturingCallback();
      }
    },
    true,
  );

  // read message from background script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse,
  ) {
    console.log('onMessage', request, sender, sendResponse);
    if (request.action == 'right_menu_clicked') {
      console.log('right_menu_clicked', request);

      const xpath = getXPath(clickedEl);
      console.log('xpath', xpath);
      const elementByXpath = getElementByXpath(xpath);

      (elementByXpath as HTMLElement).classList.add(
        'already-captured-highlighter',
      );

      console.log('element', elementByXpath);

      sendResponse({ url: request.url, xpath: xpath });
    }
  });
}
