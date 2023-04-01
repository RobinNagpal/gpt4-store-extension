chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

// https://github.com/MariusBongarts/medium-highlighter/blob/master/src/content_script.ts

const mediumHighlighter = document.createElement("medium-highlighter");
document.body.appendChild(mediumHighlighter);

const setMarkerPosition = (markerPosition: any) => mediumHighlighter.setAttribute(
  "markerPosition",
  JSON.stringify(markerPosition)
);

const getSelectedText = () => (window.getSelection() as any).toString();

document.addEventListener("click", () => {
  if (getSelectedText().length > 0) {
    setMarkerPosition(getMarkerPosition());
  }
});

document.addEventListener("selectionchange", () => {
  if (getSelectedText().length === 0) {
    setMarkerPosition({display: "none"});
  }
});

function getMarkerPosition() {
  const rangeBounds = (window
      .getSelection() as any
  ).getRangeAt(0)
    .getBoundingClientRect();
  return {
    // Substract width of marker button -> 40px / 2 = 20
    left: rangeBounds.left + rangeBounds.width / 2 - 20,
    top: rangeBounds.top - 30,
    display: "flex",
  };
}
