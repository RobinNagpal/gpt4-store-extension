import React, { useState } from 'react';
import { css } from 'glamor';

const buttonClass = css({
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  'text-align': 'center',
  'text-decoration': 'none',
  'font-size': '16px',
  display: 'inline-block',
  borderRadius: '4px',
});

const captureStartButtonClass = css({
  'background-color': '#4CAF50',
});

const captureStopButtonClass = css({
  'background-color': 'red',
});

const listener = (e) => {
  const element = document.elementFromPoint(
    e.clientX,
    e.clientY,
  ) as HTMLElement;

  const isExtensionElement =
    [
      'capture-frame-container',
      'capture-frame-wrapper',
      'capture-frame',
      'capture-start-button',
      'capture-stop-button',
    ].indexOf(element.id) < 0;

  if (isExtensionElement) {
    element.addEventListener('mouseenter', (e) => {
      const elementsByClassName = document.getElementsByClassName(
        'capture-highlighter',
      );
      for (let i = 0; i < elementsByClassName.length; i++) {
        elementsByClassName[i].classList.remove('capture-highlighter');
      }
      (e.currentTarget as HTMLElement).classList.add('capture-highlighter');
    });
  }
};

export function FrameContents() {
  const [isCapturing, setIsCapturing] = useState(false);

  const startCapture = () => {
    console.log('start capture');
    document.addEventListener('mousemove', listener, { passive: true });
    setIsCapturing(true);
  };

  const stopCapture = () => {
    setIsCapturing(false);
    document.removeEventListener('mousemove', listener);
  };
  return (
    <>
      {!isCapturing ? (
        <button
          className={`${buttonClass.toString()} ${captureStartButtonClass.toString()}`}
          id="capture-start-button"
          onClick={startCapture}
        >
          Capture
        </button>
      ) : (
        <button
          className={`${buttonClass.toString()} ${captureStopButtonClass.toString()}`}
          id="capture-stop-button"
          onClick={stopCapture}
        >
          Stop
        </button>
      )}
    </>
  );
}
