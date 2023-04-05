// create a react component which has four buttons and the buttons use react-icons icons
import React, { useCallback } from 'react';
import styled from 'styled-components';

import { FaArrowCircleUp } from '@react-icons/all-files/fa/FaArrowCircleUp';
import { FaArrowCircleDown } from '@react-icons/all-files/fa/FaArrowCircleDown';
import { FaArrowCircleLeft } from '@react-icons/all-files/fa/FaArrowCircleLeft';
import { FaArrowCircleRight } from '@react-icons/all-files/fa/FaArrowCircleRight';

const IconsWrapper = styled.div`
  display: flex;
  margin-top: 16px;
`;

const IconDiv = styled.div`
  font-size: 24px;
  padding-right: 6px;
  display: flex;
  align-items: center;
  height: 24px;
  cursor: pointer;
`;

function ElementSelectionButtons({
  selectedElement,
  setSelectedElement,
}: {
  selectedElement: HTMLElement;
  setSelectedElement: (element: HTMLElement) => void;
}) {
  const removeHighlighter = useCallback(() => {
    const elements = document.getElementsByClassName(
      'already-captured-highlighter',
    );
    const elementsLength = elements.length;
    for (let i = 0; i < elementsLength; i++) {
      elements[0].classList.remove('already-captured-highlighter');
    }
  }, []);

  const moveUp = useCallback(() => {
    selectedElement.classList.remove('already-captured-highlighter');
    selectedElement.parentElement.classList.add('already-captured-highlighter');
    setSelectedElement(selectedElement.parentElement);
  }, [selectedElement]);

  const moveDown = useCallback(() => {
    let index = 0;
    const children = selectedElement.children;
    let childElement = children && children[index];

    while (
      (childElement?.textContent?.trim()?.length || 0) < 200 &&
      index < children.length
    ) {
      console.log('childElement has less number of characters :', childElement);
      childElement = children[++index];
    }

    if (childElement) {
      removeHighlighter();
      childElement.classList.add('already-captured-highlighter');
      setSelectedElement(childElement as HTMLElement);
    }
  }, [selectedElement]);

  const moveLeft = useCallback(() => {
    let previousElement = selectedElement.previousElementSibling;
    while ((previousElement?.textContent?.trim()?.length || 0) < 200) {
      previousElement = previousElement.previousElementSibling;
    }
    if (previousElement) {
      removeHighlighter();
      previousElement.classList.add('already-captured-highlighter');
      setSelectedElement(previousElement as HTMLElement);
    }
  }, [selectedElement]);

  const moveRight = useCallback(() => {
    let nextElement = selectedElement.nextElementSibling;
    while ((nextElement?.textContent?.trim()?.length || 0) < 200) {
      nextElement = nextElement.nextElementSibling;
    }
    if (nextElement) {
      removeHighlighter();
      nextElement.classList.add('already-captured-highlighter');
      setSelectedElement(nextElement as HTMLElement);
    }
  }, [selectedElement]);

  return (
    <IconsWrapper>
      <IconDiv>
        <FaArrowCircleUp onClick={moveUp} />
      </IconDiv>
      <IconDiv>
        <FaArrowCircleDown onClick={moveDown} />
      </IconDiv>
      <IconDiv>
        <FaArrowCircleLeft onClick={moveLeft} />
      </IconDiv>
      <IconDiv>
        <FaArrowCircleRight onClick={moveRight} />
      </IconDiv>
    </IconsWrapper>
  );
}

export default ElementSelectionButtons;
