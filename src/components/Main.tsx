// create a react component
import IndexCheckboxes from '@/components/IndexCheckboxes';
import { getElementByXpath, getXPath } from '@/utils/Xpaths';
import React, { useEffect, useState } from 'react';
import CaptureButtons from '@/components/CaptureButtons';
import Frame from '@/components/Frame';
import styled from 'styled-components';

const MainDiv = styled.div`
  padding: 16px;
`;
function Main() {
  const [selectedElement, setSelectedElement] = useState<HTMLElement>();

  useEffect(() => {
    // add event listener to capture right click and set selected element
    document.addEventListener(
      'contextmenu',
      function (event: MouseEvent) {
        setSelectedElement(event.target as HTMLElement);
      },
      true,
    );
  }, [selectedElement]);

  useEffect(() => {
    // read message from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('onMessage', request, sender, sendResponse);
      if (request.action == 'right_menu_clicked') {
        const xpath = getXPath(selectedElement);
        const elementByXpath = getElementByXpath(xpath) as HTMLElement;
        elementByXpath.classList.add('already-captured-highlighter');
        elementByXpath.classList.remove('capture-highlighter');

        sendResponse({ url: request.url, xpath: xpath });
      }

      if (request.action == 'highlight_already_selected') {
        const xpath = getXPath(selectedElement);
        // const elementByXpath = getElementByXpath(xpath) as HTMLElement;
        // elementByXpath.classList.add('already-captured-highlighter');
      }
    });
  }, [selectedElement]);

  return (
    <Frame selectedElement={selectedElement}>
      <MainDiv>
        <IndexCheckboxes />
        <CaptureButtons
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
        />
      </MainDiv>
    </Frame>
  );
}

export default Main;
