$( document ).ready(function() {
	$("#testMessage").bind("click",testMessage);
	$("#testConnect").bind("click",testConnect);
	$("#setting").bind("click",function(){
		chrome.runtime.openOptionsPage();
	});
	$('#uploadPhoto').bind("click",function(){
		chrome.runtime.sendMessage({method:"getStatus"},function(response){
			console.log(chrome.runtime.lastError);
		})
	});
	$("#uploadQueue").bind("click",function(){
		chrome.storage.sync.get(["imageQ"], function(result) {
			console.log(result);
			//reset the dropdownQueue
			$("#dropdownQueue").html("");
			let data = result['imageQ'];

			$.each(data,function(index,value){
				dropdownData = '<a class="dropdown-item">'+value+'</a>'
				$("#dropdownQueue").append(dropdownData);
				
				
			}); 
		});
	});
	$("#uploadQueueReset").bind("click",function(){
		//reset chrome storage
		let reset = {}
		reset["imageQ"]=[]
		chrome.storage.sync.set(reset,function(){
			console.log("reset success");
		});
		//reset the queue dropdown
		$("#dropdownQueue").html("");
	});

});

function setChildTextNode(elementId, text) {
	$("#"+elementId).innerText = text;
}

function testMessage(){
	$("#resultsMessage").text("running...");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var t0 = performance.now();
		var tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, {counter: 1}, function handler(response) {
			console.log(response)
			if (response.counter < 1000) {
				//$("#resultsMessage").text(response.counter);
				chrome.tabs.sendMessage(tab.id, {counter: response.counter}, handler);

			} else {
				var t1 = performance.now();
				var msec = Math.round((t1 - t0));
				$("#resultsMessage").text(msec + "msec");
			}
		});
	});
}

function testConnect(){
	$("#resultsConnect").text("running...");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var t0 = performance.now();
		var port = chrome.tabs.connect(tabs[0].id);
		port.postMessage({counter: 1});
		// port.onMessage.addListener(function getResp(response) {
		// 	if (response.counter < 1000) {
		// 		port.postMessage({counter: response.counter});
		// 	} else {
		// 		var t1 = performance.now();
		// 		var msec = Math.round((t1 - t0));
		// 		$("#resultsConnect").text(msec + "msec");
	
		// 	}
		// });
	});
}