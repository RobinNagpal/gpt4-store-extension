import React, { useCallback, useState } from 'react';
import { css } from 'glamor';
import styled from 'styled-components';

// convert the following glamor code to styled-components
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

const Button = styled.button`
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  display: inline-block;
  border-radius: 4px;
  margin: 16px;
`;

const CaptureStartButton = styled(Button)`
  background-color: #4caf50;
`;

const CaptureStopButton = styled(Button)`
  background-color: red;
`;

export class CaptureButton extends React.Component<
  { captureGlobal: any },
  { isCapturing: boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      isCapturing: false,
    };
  }

  componentDidMount() {
    this.props.captureGlobal.stopCapturingCallback = () => {
      console.log('stop capturing callback in componentDidMount');
      this.setState({ isCapturing: false });
    };
  }

  listener = (e) => {
    const element = document.elementFromPoint(
      e.clientX,
      e.clientY,
    ) as HTMLElement;

    const isExtensionElement = document
      .getElementById('capture-root-node')
      .contains(element);

    if (!isExtensionElement && this.state?.isCapturing) {
      element.addEventListener(
        'mouseenter',
        (e) => {
          const elementsByClassName = document.getElementsByClassName(
            'capture-highlighter',
          );
          for (let i = 0; i < elementsByClassName.length; i++) {
            elementsByClassName[i].classList.remove('capture-highlighter');
          }
          if (this.state?.isCapturing) {
            (e.currentTarget as HTMLElement).classList.add(
              'capture-highlighter',
            );
          }
        },
        { once: true, passive: true },
      );
    }
  };

  startCapture = () => {
    this.setState({ isCapturing: true });
    document.addEventListener('mousemove', this.listener, { passive: true });
  };

  stopCapture = () => {
    this.setState({ isCapturing: false });
    document.removeEventListener('mousemove', this.listener);
  };

  render() {
    const capturing = this.state?.isCapturing;
    return (
      <>
        {!capturing ? (
          <CaptureStartButton onClick={this.startCapture}>
            Capture
          </CaptureStartButton>
        ) : (
          <CaptureStopButton onClick={this.stopCapture}>Stop</CaptureStopButton>
        )}
      </>
    );
  }
}

export default CaptureButton;
