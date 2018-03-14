
console.log("Content script is loaded");

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
		sendResponse({counter: request.counter+1});
	});

chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		console.log(msg);
		port.postMessage({counter: msg.counter+1});
	});
});

 chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
  });
