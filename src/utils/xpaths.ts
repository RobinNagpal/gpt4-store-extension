// https://stackoverflow.com/a/9198430/440432
export function getXPath(node) {
  var comp,
    comps = [];
  var parent = null;
  var xpath = '';
  var getPos = function (node) {
    var position = 1,
      curNode;
    if (node.nodeType == Node.ATTRIBUTE_NODE) {
      return null;
    }
    for (
      curNode = node.previousSibling;
      curNode;
      curNode = curNode.previousSibling
    ) {
      if (curNode.nodeName == node.nodeName) {
        ++position;
      }
    }
    return position;
  };

  if (node instanceof Document) {
    return '/';
  }

  for (
    ;
    node && !(node instanceof Document);
    node =
      node.nodeType == Node.ATTRIBUTE_NODE ? node.ownerElement : node.parentNode
  ) {
    comp = comps[comps.length] = {};
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        comp.name = 'text()';
        break;
      case Node.ATTRIBUTE_NODE:
        comp.name = '@' + node.nodeName;
        break;
      case Node.PROCESSING_INSTRUCTION_NODE:
        comp.name = 'processing-instruction()';
        break;
      case Node.COMMENT_NODE:
        comp.name = 'comment()';
        break;
      case Node.ELEMENT_NODE:
        comp.name = node.nodeName;
        break;
    }
    comp.position = getPos(node);
  }

  for (var i = comps.length - 1; i >= 0; i--) {
    comp = comps[i];
    xpath += '/' + comp.name;
    if (comp.position != null) {
      xpath += '[' + comp.position + ']';
    }
  }

  return xpath;
}

// https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript#document.evaluate
export function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
}
