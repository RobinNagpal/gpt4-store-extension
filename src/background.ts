function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Capture Text',
    contexts: ['all'],
    type: 'normal',
    id: 'myContextMenuId',
    visible: true,
  });
});

// add click event listener for the context menu

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'myContextMenuId') {
    chrome.tabs.sendMessage(tab.id, { action: 'right_menu_clicked' });
  }
});
