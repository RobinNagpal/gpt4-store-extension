import { CaptureActionButton } from '@/components/capture/CaptureActionButton';
import ElementSelectionButtons from '@/components/ElementSelectionButtons';
import React from 'react';

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
      ?.contains(element);

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

  indexCapture = () => {
    this.setState({ isCapturing: false });
    document.removeEventListener('mousemove', this.listener);
  };

  render() {
    const capturing = this.state?.isCapturing && !this.props.selectedElement;
    return (
      <div>
        <CaptureActionButton
          capturing={this.state?.isCapturing}
          startCaptureFn={this.startCapture}
          selectedElement={this.props.selectedElement}
          stopCaptureFn={this.stopCapture}
          indexCaptureFn={this.indexCapture}
        />
        <div>
          {this.props.selectedElement ? (
            <ElementSelectionButtons
              selectedElement={this.props.selectedElement}
              setSelectedElement={this.props.setSelectedElement}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default CaptureButtons;
