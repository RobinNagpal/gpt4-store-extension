import ElementSelectionButtons from '@/components/ElementSelectionButtons';
import React from 'react';
import styled from 'styled-components';
import { FaRecordVinyl } from '@react-icons/all-files/fa/FaRecordVinyl';
import { FaStop } from '@react-icons/all-files/fa/FaStop';

const Button = styled.button`
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 16px;
  display: flex;
`;

const CaptureStartButton = styled(Button)`
  background-color: #4caf50;
`;

const CaptureStopButton = styled(Button)`
  background-color: red;
`;

const IconDiv = styled.div`
  font-size: 14px;
  padding-right: 6px;
  display: flex;
  align-items: center;
  height: 24px;
`;

const ButtonLabel = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
`;

export class CaptureButtons extends React.Component<
  {
    selectedElement?: HTMLElement;
    setSelectedElement: (element: HTMLElement) => void;
  },
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
      <div>
        {!capturing ? (
          <CaptureStartButton onClick={this.startCapture}>
            <IconDiv>
              <FaRecordVinyl />
            </IconDiv>{' '}
            <ButtonLabel>Capture</ButtonLabel>
          </CaptureStartButton>
        ) : (
          <CaptureStopButton onClick={this.stopCapture}>
            <IconDiv>
              <FaStop />
            </IconDiv>{' '}
            <ButtonLabel>Stop</ButtonLabel>
          </CaptureStopButton>
        )}
        {this.props.selectedElement ? (
          <ElementSelectionButtons
            selectedElement={this.props.selectedElement}
            setSelectedElement={this.props.setSelectedElement}
          />
        ) : null}
      </div>
    );
  }
}

export default CaptureButtons;
