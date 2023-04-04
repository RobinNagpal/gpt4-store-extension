// create a react component
import { CaptureGlobals } from '@/utils/CaptureGlobals';
import { getElementByXpath, getXPath } from '@/utils/Xpaths';
import React, { useEffect, useState } from 'react';
import CaptureButtons from '@/components/CaptureButtons';
import Frame from '@/components/Frame';
import IndexDropdown from '@/components/IndexDropdown';

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
        const elementByXpath = getElementByXpath(xpath);

        (elementByXpath as HTMLElement).classList.add(
          'already-captured-highlighter',
        );

        console.log('element', elementByXpath);

        sendResponse({ url: request.url, xpath: xpath });
      }
    });
  }, [selectedElement]);

  return (
    <Frame>
      <IndexDropdown />
      <CaptureButtons selectedElement={selectedElement} />
    </Frame>
  );
}

export default Main;
