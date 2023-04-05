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
    document.addEventListener(
      'contextmenu',
      function (event: MouseEvent) {
        setSelectedElement(event.target as HTMLElement);
      },
      true,
    );

    // read message from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('onMessage', request, sender, sendResponse);
      if (request.action == 'right_menu_clicked') {
        console.log('right_menu_clicked', request);

        const xpath = getXPath(selectedElement);

        console.log('xpath', xpath);

        const elementByXpath = getElementByXpath(xpath) as HTMLElement;

        elementByXpath.classList.add('already-captured-highlighter');
        elementByXpath.classList.remove('capture-highlighter');

        console.log('element', elementByXpath);

        sendResponse({ url: request.url, xpath: xpath });
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
