import React from 'react';
import styled from 'styled-components';

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

export class CaptureButtons extends React.Component<
  { selectedElement?: HTMLElement },
  { isCapturing: boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      isCapturing: false,
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
          if (this.state?.isCapturing && !this.props.selectedElement) {
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
    const capturing = this.state?.isCapturing && !this.props.selectedElement;
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

export default CaptureButtons;
