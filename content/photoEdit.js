console.log("this is photoEdit")
$( document ).ready(function() {
	var camanSrc = chrome.extension.getURL('js/caman.full.min.js');
	var src = chrome.extension.getURL('content/inject.js');
	var formHTML = chrome.extension.getURL("note.html");
	var camanScript = $("<script>", {
		"src": camanSrc
		});
	var injectScript = $("<script>", {
		"src": src
		});
	var hiddenDiv = $("<div>",{
		"class" : "hidden"
	});
	var div = $("<div>",{
		"id":"anywhere-upload-myedit"

	})

	div.load(formHTML);
	hiddenDiv.append(div);

	$("body").append(camanScript);
	$("body").append(injectScript);
	$("div#anywhere-upload").append(hiddenDiv);

});

window.addEventListener('message', function(event) {

  if (event.source !== window) 
    return;
  var image = event.data;
  console.log(image)
  if (typeof image !== 'object' || image === null || !image.url) 
    return;
  chrome.runtime.sendMessage(image, function(response) {
	  console.log(chrome.runtime.lastError)
	  console.log(response)
	  window.postMessage(response,"*")
	});
});