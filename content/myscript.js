
console.log("Content script is loaded");

// chrome.runtime.onMessage.addListener(
// 	function(request, sender, sendResponse) {
// 		console.log(request);
//     $( document ).ready(function() {
//       console.log( "ready!" );
//       $("li[data-action='top-bar-upload'].pop-btn").click();
//       var src = chrome.extension.getURL('popup/inject.js');
//       var script = "<script src='"+src+"'></script>"
//       $("body").append(script);
//     });
//     sendResponse({counter: request.counter+1});
//   });

// chrome.runtime.onConnect.addListener(function(port) {
// 	port.onMessage.addListener(function(msg) {
//     console.log("2134567")
//     $( document ).ready(function() {
//       console.log( "ready!" );
//       $("li[data-action='top-bar-upload'].pop-btn").click();
//       var src = chrome.extension.getURL('popup/inject.js');
//       var script = "<script src='"+src+"'></script>"
//       $("body").append(script);
//     });
// 		//port.postMessage({counter: msg.counter+1});
// 	});
// });

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

// chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
//   console.log(chrome.runtime.lastError)
// });

