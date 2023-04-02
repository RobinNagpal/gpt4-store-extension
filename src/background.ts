function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();


console.log('Chrome Github Trending Sidebar Extension Registered')

chrome.browserAction.onClicked.addListener((tab: any) => {
  console.log('Browser Action Triggered')
  // for the current tab, inject the "inject.js" file & execute it
  chrome.tabs.executeScript(tab.id, {
    file: 'entry.js'
  })
})
