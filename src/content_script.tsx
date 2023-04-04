import React from 'react';
import ReactDOM from 'react-dom';
import { CaptureGlobals } from '@/utils/CaptureGlobals';
import CaptureButtons from '@/components/CaptureButton';
import Frame from './components/frame';
import IndexDropdown from './components/index_dropdown';
import { getElementByXpath, getXPath } from './utils/xpaths';

// https://github.com/MariusBongarts/medium-highlighter/blob/master/src/content_script.ts
if (Frame.isReady()) {
  Frame.toggle();
} else {
  boot();
}

function boot() {
  const captureGlobal: CaptureGlobals = {};

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
      <CaptureButtons captureGlobal={captureGlobal} />
    </Frame>
  );

  ReactDOM.render(App, root);

  document.addEventListener(
    'contextmenu',
    function (event: MouseEvent) {
      captureGlobal.selectedElement = event.target as HTMLElement;
      console.log('stop capturing callback');
      if (
        captureGlobal.selectedElement &&
        captureGlobal.stopCapturingCallback
      ) {
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

      const xpath = getXPath(captureGlobal.selectedElement);
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
