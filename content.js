// Send the webpage content to the background script
chrome.runtime.sendMessage({
  content: document.body.innerText
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.isTriggering) {
    alert('Warning: This website may contain triggering content.');
  }
});
