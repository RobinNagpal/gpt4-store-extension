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
    if (tab?.id) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          action: 'right_menu_clicked',
          url: tab.url,
        },
        storeCaptureDataCallback,
      );
    }
  }
});

chrome.runtime.onStartup.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.storage.sync.get([ALL_DATA_KEY], function ({ all_data }) {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'highlight_already_selected',
          url: tabs[0].url,
          all_data: all_data || {},
        });
      }
    });
  });
});
