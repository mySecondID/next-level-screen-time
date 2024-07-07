let cnt = 0;
let timeForURL = new Map();
let mappingURL = new Map();
let timeForTab = new Map();
let time = new Date().getTime();
let currentActive = -1;
let lastOne = -1;
let lastURL = "";


chrome.tabs.onActivated.addListener(async function (t) {
  console.log("activated", t);
  const x = await chrome.tabs.query({  active: true, lastFocusedWindow: true });
  console.log("activated: ", x);
  timeForTab[mappingURL[currentActive]] += (new Date().getTime() - time);
  time = new Date().getTime();
  currentActive = t;
  lastURL = ""
});


chrome.tabs.onUpdated.addListener(async function(t, tab){
  // console.log("updated", t, tab);
  if(tab.url){
    const url = tab.url;
    const siteName = url.match(/:\/\/(.[^/]+)/)[1];
    console.log(siteName);
    if(siteName === "www.youtube.com"){
      console.log("andar");
      const match = url.match(/\/(watch)/);
      if (match) {
          console.log(match[1]);
          // const myHeaders = new Headers();
          // myHeaders.append("Content-Type", "application/json");
          // myHeaders.append("Authorization", "Basic Og==");
    
          // const raw = JSON.stringify({
          //   "title": "data tutorial",
          //   "description": "lets learn about data"
          // });
    
          // const requestOptions = {
          //   method: "POST",
          //   headers: myHeaders,
          //   body: raw,
          //   redirect: "follow"
          // };
    
          // fetch("http://localhost:8000/api/v1/getcategory", requestOptions)
          // .then((response) => response.text())
          // .then((result) => console.log(result))
          // .catch((error) => console.error(error));
      }else{
        
      }
    }
    console.log(timeForTab, mappingURL, new Date().getTime() - time);
    if(mappingURL.get(currentActive) && timeForTab.get(mappingURL.get(currentActive))){
      timeForTab.set(mappingURL.get(currentActive), timeForTab.get(mappingURL.get(currentActive)) + (new Date().getTime() - time));
    }else{
      mappingURL.set(currentActive, lastURL);
      console.log(lastURL, "bitch")
      timeForTab.set(mappingURL.get(currentActive), (new Date().getTime() - time));
    }
    time = new Date().getTime();
    currentActive = t;
    lastURL = siteName;
    mappingURL.set(currentActive, siteName);
  }
  // console.log(t, (new Date().getTime() - time) / 60000)
  // time = new Date().getTime();

});


chrome.windows.onFocusChanged.addListener(function(windowId) {
  console.log(windowId)
  if(windowId === -1){
    // add time of the last one
    if(mappingURL.get(currentActive) && timeForTab.get(mappingURL.get(currentActive))){
      timeForTab.set(mappingURL.get(currentActive), timeForTab.get(mappingURL.get(currentActive)) + (new Date().getTime() - time));
    }else{
      mappingURL.set(currentActive, lastURL);
      console.log(lastURL, "bitch")
      timeForTab.set(mappingURL.get(currentActive), (new Date().getTime() - time));
    }
    timeForTab.set(mappingURL.get(currentActive), timeForTab.get(mappingURL.get(currentActive)) + (new Date().getTime() - time));
    time = new Date().getTime();
    currentActive = -1;
  }
});


chrome.tabs.onRemoved.addListener(async function(t, tabInfo){
  console.log("closed", t, tabInfo);
  const x = await chrome.tabs.query({});
  // mappingURL.erase();
  console.log(x);
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