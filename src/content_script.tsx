import Frame from '@/components/Frame';
import Main from '@/components/Main';
import { CaptureGlobals } from '@/utils/CaptureGlobals';
import React from 'react';
import ReactDOM from 'react-dom';

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
    }
    .already-captured-highlighter {
      border: 4px solid red !important;
    }
  `;
  document.getElementsByTagName('head')[0].appendChild(styleElement);

  document.body.appendChild(root);

  const App = <Main />;

  ReactDOM.render(App, root);
}
