import { ALL_DATA_KEY } from '@/utils/Constants';

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

function storeCaptureDataCallback({ url, element }) {
  chrome.storage.sync.get([ALL_DATA_KEY], function ({ all_data }) {
    console.log(ALL_DATA_KEY, all_data);
    chrome.storage.sync.set({
      all_data: { ...(all_data || {}), [url]: [element] },
    });
  });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log('info', info);
  console.log('tab', tab);
  if (info.menuItemId === 'myContextMenuId') {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: 'right_menu_clicked',
        url: tab.url,
      },
      storeCaptureDataCallback,
    );
  }
});
