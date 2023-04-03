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

// A function to use as callback
function doStuffWithDom({ url, element }) {
  chrome.storage.sync.get(['all_data'], function ({ all_data }) {
    console.log('all_data', all_data);
    chrome.storage.sync.set({
      all_data: { ...(all_data || {}), [url]: [element] },
    });
  });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'myContextMenuId') {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: 'right_menu_clicked',
        url: tab.url,
      },
      doStuffWithDom,
    );
  }
});
