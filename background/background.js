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
			let url = info.linkUrl;
			arrayQ.unshift(url);
			//set a json object
			var jsonQ = {};
			jsonQ["imageQ"] = arrayQ;
			//set of storage
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