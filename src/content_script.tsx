import React from 'react'
import ReactDOM from 'react-dom'
import Frame from './frame/frame'

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

// https://github.com/MariusBongarts/medium-highlighter/blob/master/src/content_script.ts

if (Frame.isReady()) {
  Frame.toggle()
} else {
  boot()
}

function boot() {
  const root = document.createElement('div')

  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .capture-highlighter {
      border: 2px solid red;
    }
  `
  document.getElementsByTagName("head")[0].appendChild(styleElement);

  document.body.appendChild(root)

  const startCapture = () => {
    console.log('start capture');
    document.addEventListener('mousemove', e => {
      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      element.addEventListener('mouseenter', e => {
        const elementsByClassName = document.getElementsByClassName('capture-highlighter');
        for(let i = 0; i < elementsByClassName.length; i++) {
          elementsByClassName[i].classList.remove('capture-highlighter');
        }
        (e.currentTarget as HTMLElement).classList.add('capture-highlighter');
      });

    }, {passive: true})
  }

  const App = (
    <Frame >
      <div id="capture">
        <button id="captureButton" onClick={startCapture}>Capture</button>
      </div>
    </Frame>
  )

  ReactDOM.render(App, root)
}
