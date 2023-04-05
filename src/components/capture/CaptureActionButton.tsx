import { FaRecordVinyl } from '@react-icons/all-files/fa/FaRecordVinyl';
import { FaStop } from '@react-icons/all-files/fa/FaStop';
import React from 'react';
import styled from 'styled-components';

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

export function CaptureActionButton(props: {
  capturing: boolean | undefined;
  startCaptureFn: () => void;
  selectedElement?: HTMLElement;
  stopCaptureFn: () => void;
  indexCaptureFn: () => void;
}) {
  return (
    <div>
      {!props.capturing ? (
        <CaptureStartButton onClick={props.startCaptureFn}>
          <IconDiv>
            <FaRecordVinyl />
          </IconDiv>{' '}
          <ButtonLabel>Capture</ButtonLabel>
        </CaptureStartButton>
      ) : null}

      {props.capturing && !props.selectedElement ? (
        <CaptureStopButton onClick={props.stopCaptureFn}>
          <IconDiv>
            <FaStop />
          </IconDiv>{' '}
          <ButtonLabel>Stop</ButtonLabel>
        </CaptureStopButton>
      ) : null}

      {props.selectedElement ? (
        <CaptureStopButton onClick={props.indexCaptureFn}>
          <IconDiv>
            <FaStop />
          </IconDiv>{' '}
          <ButtonLabel>Index</ButtonLabel>
        </CaptureStopButton>
      ) : null}
    </div>
  );
}
