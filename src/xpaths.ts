function createXPathFromElement(elm: Element): string | null {
  const allNodes = document.getElementsByTagName('*');
  const segs: string[] = [];

  while (elm && elm.nodeType === 1) {
    if (elm.hasAttribute('id')) {
      let uniqueIdCount = 0;
      for (let n = 0; n < allNodes.length; n++) {
        if (allNodes[n].hasAttribute('id') && allNodes[n].id === elm.id)
          uniqueIdCount++;
        if (uniqueIdCount > 1) break;
      }

      if (uniqueIdCount === 1) {
        segs.unshift('id("' + elm.getAttribute('id') + '")');
        return segs.join('/');
      } else {
        segs.unshift(
          elm.localName.toLowerCase() +
            '[@id="' +
            elm.getAttribute('id') +
            '"]',
        );
      }
    } else if (elm.hasAttribute('class')) {
      segs.unshift(
        elm.localName.toLowerCase() +
          '[@class="' +
          elm.getAttribute('class') +
          '"]',
      );
    } else {
      let i = 1;
      let sib: any = elm.previousSibling;
      while (sib) {
        if (sib.localName === elm.localName) i++;
        sib = sib.previousSibling;
      }
      segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
    }
    elm = elm.parentNode as Element;
  }

  return segs.length ? '/' + segs.join('/') : null;
}

function lookupElementByXPath(path: string): Element | null {
  const evaluator = new XPathEvaluator();
  const result = evaluator.evaluate(
    path,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  );
  return result.singleNodeValue as Element;
}
