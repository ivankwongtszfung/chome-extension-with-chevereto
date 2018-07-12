$(document).ready(function(){
	var successFlag = 0;
	chrome.storage.sync.get(["hostname"], function(result){
		if(!result){
			return
		}
		$("#hostname").val(result['hostname']);
	});
	$("#save").bind("click",function(){
	let hostname=$("#hostname").val();
	if (!hostname) {
		$("#signal").html('<div id="warningSignal" class="alert alert-warning alert-dismissible">\
  			<strong>Warning!</strong> data is empty.\
	  		</div>');
		return;
	}
	chrome.storage.sync.set({ "hostname": hostname }, function(){
		console.log("session saved.")
		$("#signal").html('<div id="successSignal" class="alert alert-success alert-dismissible">\
  			<strong>Success!</strong> we will close the tab after 3 seconds.\
	  		</div>');
		setTimeout(function(){window.close()},3000) 
		});
	});
});