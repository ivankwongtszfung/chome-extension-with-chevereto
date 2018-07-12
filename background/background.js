var chromeStorage = "";

chrome.storage.sync.get(["imageQ"], function(result) {
	//reset the dropdownQueue
	let data = result['imageQ'];
	chromeStorage = data;
	chromeStorage=chromeStorage.join("\n")
	console.log(chromeStorage);
});


contextObject=
{
	type :"normal",
	title :"chevereto",
	contexts :["image"],
	onclick:function(info,tab){
		console.log("context menu clicked");
		//mediaType: return image, video,audio
		//srcUrl:'src' URL
		//image linkUrl
		if(!(info.linkUrl)){
			return
		}
		chrome.storage.sync.get(["imageQ"], function(result) {
			//add element in the array
			let arrayQ = result["imageQ"]?result["imageQ"]:[];
			let url = info.srcUrl;
			arrayQ.unshift(url);
			//set a json object
			var jsonQ = {};
			jsonQ["imageQ"] = arrayQ;
			//set of storage
			console.log(info.srcUrl)
			console.log(info)
			chrome.storage.sync.set(jsonQ, function() {
			    console.log("Saved a new array item");
			});
		});
		// chrome.tabs.create({		
		// 	url:"http://www.google.com/search?q=" + info.selectionText	
		// }
		//);
	}
}
chrome.contextMenus.create(contextObject,function(){
	console.log(chrome.runtime.lastError);
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue);
    let data = storageChange.newValue;
	chromeStorage = data;
	chromeStorage=chromeStorage.join("\n")
	console.log(chromeStorage);
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	var send = sendResponse;
	console.log(request)
	if("method" in request){
		if (request.method == "getStatus"){
    		var address = "";
			var string ="";
			var tab = "";
			chrome.storage.sync.get(["hostname","imageQ"], function(result){
				address=result["hostname"];
				var data = result['imageQ'];
				chromeStorage = data;
				data=chromeStorage.join(" ")
				console.log(chromeStorage);
				chrome.tabs.create({url:address,active:false},function(tabs){
					tab=tabs.id;
					chrome.tabs.executeScript(tab,{file:"js/jquery.min.js"}, function() {
						chrome.tabs.executeScript(tab, {code: "var data = '"+data+"';"}, function() {
							chrome.tabs.executeScript(tab, {file: 'popup/priorScript.js'}, function() {
								chrome.tabs.update(tab,{active:true},function(){
									sendResponse({});

								})
							});
						});
					});
				});
			});
			return true
		}
		else{
			console.log("not get status")
			sendResponse({}); // snub them.
		}
	}
	else if("url" in request){
		var URL=request.url,
		    img = new Image(),
		    target_canvas=$('<canvas/>', {'class': 'canvas'})[0],
		    base64 = '' ;
		
		img.src = URL
		img.onload = function(){
			target_canvas.width=img.width
			target_canvas.height=img.height
			var target_canvas_ctx = target_canvas.getContext('2d')
		    target_canvas_ctx.drawImage(img,0,0)
		    base64=target_canvas.toDataURL()
		    console.log(base64)
		    sendResponse({"dataurl":base64});
		 }
		 return true;


	}
    

      
});




// chrome.tabs.create({url:address,active:false},function(tabs){
// 				tab=tabs.id;
// 				chrome.tabs.executeScript(tab,{file:"js/jquery.min.js"}, function() {
// 					 chrome.tabs.executeScript(tab, {
// 					    code: "var data = '"+string+"';"
// 					  }, function() {
// 					   chrome.tabs.executeScript(tab, {file: 'popup/script.js',runAt:'document_end'}, function() {
// 						chrome.tabs.update(tab,{active:true});
// 					  });
// 				});
// 			});

// chrome.storage.sync.get(["hostname","imageQ"], function(result){
// 			address=result["hostname"];
// 			string=result["imageQ"][0];
			
// 		});

	