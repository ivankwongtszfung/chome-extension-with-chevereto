
$(window).on("load",function(){
	console.log("prior Script")
	console.log(data)
	$("li[data-action='top-bar-upload'].pop-btn").click();
	$("a[data-target=anywhere-upload-paste-url]")[0].click();
	setTimeout(function(){
	 	$("div#fullscreen-modal-body div.modal-form textarea").val(data);
		$("button.btn.btn-input.default").click();
	 }, 1000);

	console.log("data filling")
})