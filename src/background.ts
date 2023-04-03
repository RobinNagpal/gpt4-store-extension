function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();

console.log('Chrome Github Trending Sidebar Extension Registered');

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Capture Text',
    contexts: ['all'],
    id: 'myContextMenuId',
  });
});
