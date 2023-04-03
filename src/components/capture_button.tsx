import React, { useCallback, useState } from 'react';
import { css } from 'glamor';

const buttonClass = css({
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: '16px',
  display: 'inline-block',
  borderRadius: '4px',
  margin: '16px',
});

const captureStartButtonClass = css({
  backgroundColor: '#4CAF50',
});

const captureStopButtonClass = css({
  backgroundColor: 'red',
});

export function CaptureButton() {
  const [isCapturing, setIsCapturing] = useState(false);

  const listener = useCallback((e) => {
    const element = document.elementFromPoint(
      e.clientX,
      e.clientY,
    ) as HTMLElement;

    const isExtensionElement = document
      .getElementById('capture-root-node')
      .contains(element);

    if (!isExtensionElement) {
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
  }, []);

  const startCapture = useCallback(() => {
    console.log('start capture');
    setIsCapturing(true);
    document.addEventListener('mousemove', listener, { passive: true });
  }, []);

  const stopCapture = useCallback(() => {
    setIsCapturing(false);
    document.removeEventListener('mousemove', listener);
  }, []);

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

export default CaptureButton;
