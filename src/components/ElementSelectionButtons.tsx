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
    const parentElement = selectedElement.parentElement;
    if (parentElement) {
      selectedElement.classList.remove('already-captured-highlighter');
      parentElement.classList.add('already-captured-highlighter');
      setSelectedElement(parentElement);
    }
  }, [selectedElement]);

  const moveDown = useCallback(() => {
    let index = 0;
    const children = selectedElement.children;
    let childElement = children && children[index];
    let childTextLength = childElement?.textContent?.trim()?.length || 0;

    while (childTextLength < 200 && index < children.length) {
      childElement = children[++index];
    }

    if (childTextLength >= 200) {
      removeHighlighter();
      console.log('childElement', childTextLength);
      childElement.classList.add('already-captured-highlighter');
      setSelectedElement(childElement as HTMLElement);
    } else {
      console.log(
        'Not selecting child element as length is not apt',
        childTextLength,
        childElement,
      );
    }
  }, [selectedElement]);

  const moveLeft = useCallback(() => {
    console.log(
      'selectedElement',
      selectedElement,
      'previousElement',
      selectedElement?.previousElementSibling,
    );
    let previousElement = selectedElement.previousElementSibling;
    while (
      previousElement &&
      (previousElement?.textContent?.trim()?.length || 0) < 200
    ) {
      previousElement = previousElement.previousElementSibling;
    }
    if (previousElement) {
      removeHighlighter();
      previousElement.classList.add('already-captured-highlighter');
      setSelectedElement(previousElement as HTMLElement);
    }
  }, [selectedElement]);

  const moveRight = useCallback(() => {
    console.log(
      'selectedElement',
      selectedElement,
      'nextElementSibling',
      selectedElement?.nextElementSibling,
    );

    let nextElement = selectedElement.nextElementSibling;
    while (
      nextElement &&
      (nextElement?.textContent?.trim()?.length || 0) < 200
    ) {
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
