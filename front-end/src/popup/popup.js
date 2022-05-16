// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

const timeElement = document.getElementById("time");
const currentTime = new Date().toLocaleTimeString();

// 시간 h2에 적용시키기
timeElement.textContent = `The time is: ${currentTime}`;

// Badge 설정하기
chrome.action.setBadgeText({
  text:"TIME",
}, ()=>{
  console.log("Finished sestting badge text.");
})

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
