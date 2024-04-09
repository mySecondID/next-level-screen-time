let cnt = 0;


chrome.tabs.onCreated.addListener(function(t){
  console.log(t);
  if(t.active){
    console.log(cnt++);
  }
});


chrome.tabs.onActivated.addListener(function (t) {
  console.log("activated", t)
})



chrome.tabs.onUpdated.addListener(function(t , tab){
  console.log("updated", t, tab);
});



chrome.tabs.onRemoved.addListener(function(t, tabInfo){
  console.log("closed", t, tabInfo);
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
    } else if (nextState === "OFF") {
      await chrome.scripting.removeCSS({
        files: ["/extensions/background.css"],
        target: { tabId: tab.id },
      });
    }
});