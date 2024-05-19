let cnt = 0;
let timeForURL = {};
let mappingURL = {};
let timeForTab = {};
let time = new Date().getTime();
let currentActive = -1;

chrome.tabs.onCreated.addListener(function(t){
  // console.log(t);
  // if(t.active){
  //   console.log(cnt++);
  // }
});

chrome.tabs.onHighlighted.addListener(function(t, wid){
  console.log(t, wid)
})


chrome.tabs.onActivated.addListener(async function (t) {
  console.log("activated", t)
  const x= await chrome.tabs.query({  active: true, lastFocusedWindow: true })
  console.log(x)
})



chrome.tabs.onUpdated.addListener(function(t , tab){
  // console.log("updated", t, tab);
  if(tab.url){
    const url = tab.url;
    const siteName = url.match(/:\/\/(.[^/]+)/)[1];
    console.log(siteName);

  }
  // console.log(t, (new Date().getTime() - time) / 60000)
  // time = new Date().getTime();

});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  console.log(windowId)
});

chrome.tabs.onRemoved.addListener(async function(t, tabInfo){
  console.log("closed", t, tabInfo);
  const x = await chrome.tabs.query({});
  console.log(x)
});



chrome.action.onClicked.addListener(async (tab) => {

    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = (prevState === 'ON' ? 'OFF' : 'ON');

    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });

    if (nextState === "ON") {
      await chrome.scripting.insertCSS({
        files: ["/extensions/background.css"],
        target: { tabId: tab.id },
      });
    } 
    else if (nextState === "OFF") {
      await chrome.scripting.removeCSS({
        files: ["/extensions/background.css"],
        target: { tabId: tab.id },
      });
    }
});