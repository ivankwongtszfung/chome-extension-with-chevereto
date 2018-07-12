"use strict";
var divContainer = $("<div>", {
		"class": "queue-item-button myedit",
		"title": "Edit"
		});
var icon = $("<span>", {
		"class": "icon icon-camera"
		});
divContainer.append(icon)
divContainer.appendTo("li.queue-item")
var modal = PF.obj.modal.selectors.root;
var camanParameter = [];
var array_canvas = {};
var changedFlag = 0;
var resetParameter = [];
var id;
$(document).on("click","li.queue-item>div.myedit",cheveretoModal);

$(document).on("click","#fullscreen-modal .btn-alt .cancel",function(){
	$.each(resetParameter[id],function(index,value){
		camanParameter[id][index]=value
	})
	console.log("caman"+camanParameter)
	console.log("reset"+resetParameter)
})

$(document).on("click","#myReset",function(){
	$.each(resetParameter[id],function(index,value){
		camanParameter[id][index]=value
	})
	sliderFilter(id);
	Caman(".image-preview .canvas", function () {
		this.revert(false);
		var self = this; 

		$.each(camanParameter[id],function(index,value){
			if((value!=0)){
				 if(index!="filter"){
					console.log(index);
					self[index](camanParameter[id][index]);
				 }
				 else if(camanParameter[id][index]!=null){
				 	console.log(camanParameter[id][index]);
				 	self[camanParameter[id][index]]();
				 }
			}
		});
		this.render(function(){
			console.log("finish rendering")
		});
	
	});
	
});
window.addEventListener('message',function(event) {

	var image = event.data;
	console.log(image)
	if(!("dataurl" in image))
		return
	console.log(123456)
	if (event.source !== window)
		return;
	console.log(image.dataurl)
	if (typeof image !== 'object' || image === null ) 
		return;

	let newCanvas=$('<canvas/>', {
			'class': 'canvas',
			'data-caman-hidpi-disabled':true
		})[0];

	var img = new Image,
	    base64 = image.dataurl;

	var target_canvas_ctx = newCanvas.getContext('2d')
	img.src = base64;
	console.log("finish")
	img.onload = function(){
		newCanvas.width = img.width
    	newCanvas.height = img.height
	    target_canvas_ctx.drawImage(img,0,0)
	    console.log("finish")
		 CHV.fn.uploader.files[id].parsedMeta['url']=1
		 array_canvas[id]=newCanvas
		var target_canvas = $(".image-preview .canvas")[0]
		target_canvas.width = array_canvas[id].width
		target_canvas.height = array_canvas[id].height
		target_canvas_ctx = target_canvas.getContext('2d')
		target_canvas_ctx.drawImage(array_canvas[id], 0, 0)
		console.log("finish loading")
	 }
	 
	 

	 

});

$(document).on("change","div.FilterSetting>input",function(e){
	let value = $( e.target ).val()
	let parameter=$( e.target ).attr("data-filter")
	//set the value of the slider and reset preset filter
	value = (parseInt(value)==parseFloat(value) ? value=parseInt(value) : value=parseFloat(value))
	camanParameter[id]=changePhoto(camanParameter[id],parameter,value);
	//remove the preset filter active state
	$("#PresetFilters a.Active").removeClass("Active");
	//set the filter value
	$( e.target ).next(".FilterValue").html(value);
	
	Caman(".image-preview .canvas", function () {
		console.log(camanParameter)
		console.log(resetParameter)
		console.log(parameter+":"+camanParameter[id][parameter])
		this.revert(false);
		var self = this; 

		$.each(camanParameter[id],function(index,value){
			if((value!=0 || parameter==index)){
				 if(index!="filter"){
					console.log(index);
					self[index](camanParameter[id][index]);
				 }
				 else if(camanParameter[id][index]!=null){
				 	console.log(camanParameter[id][index]);
				 	self[camanParameter[id][index]]();
				 }
			}
		});
		this.render(function(){
			console.log("finish rendering")
		});
	
	});
});

// $(document).on('change',"#anywhere-upload",function(event) {

// });


$(document).on("click"," #PresetFilters a",function(e){
	//remove active button
	$("#PresetFilters a.Active").removeClass("Active");
	$(this).addClass("Active");
	//init variable
	let parameter = "filter"
	let value=$( e.target ).attr("data-preset")
	camanParameter[id]=changePhoto(camanParameter[id],parameter,value)

	//change photo data
	Caman(".image-preview .canvas", function () {
		console.log(value+":"+camanParameter[id][value])
		this.revert(false);
		var self = this; 
		this[value]();
		$.each(camanParameter[id],function(index,value){
			if((value!=0 || parameter==index) && index!="filter"){
				console.log(index);
				self[index](camanParameter[id][index]);
			}
		});
		this.render(function(){
			console.log("finish rendering")
		});
	});
})


 function cheveretoModal() {
 		
        var $item = $(this).closest("li")
          , $queue = $item.closest("ul")
          , id = $item.data("id")
          , source_canvas = $(".queue-item[data-id=" + id + "] .preview .canvas")[0];
        window.id = id;
        console.log("id: "+id)

        //set the json value to slider and button
        if(!("camanjs" in CHV.fn.uploader.files[id].parsedMeta)){
        	console.log("first time edit");
        	camanParameter[id]=initCamanParameter()
        	resetParameter[id]=initCamanParameter()
        	//save a copy of camanParameter
        	array_canvas=setArray(array_canvas,id)
        }
        else{
        	//pass value of json to another json
        	camanParameter[id]=changePhoto(camanParameter[id],"filter",null)
        	$.each(camanParameter[id],function(index,value){
				resetParameter[id][index]=value
			})
        	console.log("second time edit");
        }
        var modal = PF.obj.modal.selectors.root;
        PF.fn.modal.call({
            type: "html",
            template: $("#anywhere-upload-myedit").html(),
            callback: function() {
                //set the value of slider
                console.log("set the value of slider")
                sliderFilter(id)
                CHV.fn.uploader.files[id].parsedMeta["camanjs"]=1
                $(".image-preview", modal).append($('<canvas/>', {
                    'class': 'canvas',
                    'data-caman-hidpi-disabled':true
                }))
                if(CHV.fn.uploader.files[id].url===undefined){
					var target_canvas = $(".image-preview .canvas", modal)[0]
					target_canvas.width = array_canvas[id].width
					target_canvas.height = array_canvas[id].height
					var target_canvas_ctx = target_canvas.getContext('2d')
					target_canvas_ctx.drawImage(array_canvas[id], 0, 0)
                }
                else{

					var URL = CHV.fn.uploader.files[id].url
					if('url' in CHV.fn.uploader.files[id].parsedMeta){
						console.log("123456")
						var target_canvas = $(".image-preview .canvas", modal)[0]
						target_canvas.width = array_canvas[id].width
						target_canvas.height = array_canvas[id].height
						var target_canvas_ctx = target_canvas.getContext('2d')
						target_canvas_ctx.drawImage(array_canvas[id], 0, 0)
					}

                }



                if(changedFlag){
                	console.log("photo is changed")

					Caman(".image-preview .canvas", function () {
						this.revert(false);
						var self = this; 
						$.each(camanParameter[id],function(index,value){

							if(index!="filter"){

								if(value!=0 ){
									//photo parameter
									console.log(index);
									self[index](camanParameter[id][index]);
								}
							}
							else{
								//filter
								if(value!=null)
									self[value]();
							}
						});
						this.render(function(){

							console.log("finish rendering")
						});

					});
				} 
				return true     
            },
            confirm: function() {
                // if (!PF.fn.form_modal_has_changed()) {
                //     PF.fn.modal.close();
                //     return;
                // }
                console.log("upload confirm")
                var source_canvas=$(".queue-item[data-id=" + id + "] .preview .canvas")[0];
                var target_canvas = $(".image-preview .canvas", modal)[0]
				var target_canvas_ctx = source_canvas.getContext('2d')
				target_canvas_ctx.drawImage(target_canvas, 0, 0)

				target_canvas.toBlob(function(blob) {
					console.log(CHV.fn.uploader.files[id])
					blob.parsedMeta = CHV.fn.uploader.files[id].parsedMeta
					blob.parsedMeta["camanjs"]=1
					blob.name = CHV.fn.uploader.files[id].name
					CHV.fn.uploader.files[id]=blob
				  });

				//after we save the canvas we can do the revert the change 
				//and apply the preset only
				Caman(array_canvas[id],function(){
					console.log(camanParameter)
					this.revert();
					if(camanParameter[id]["filter"]!=null)
						this[camanParameter[id]["filter"]]();
					this.render();
				})



				changedFlag=1

				PF.fn.modal.close();
				return false
            }
        });

        
    }

function initCamanParameter(){
	var json={
		"brightness":0,
		"contrast":0,
		"saturation":0,
		"vibrance":0,
		"exposure":0,
		"hue":0,
		"sepia":0,
		"gamma":1.0,
		"noise":0,
		"clip":0,
		"sharpen":0,
		"stackBlur":0
		,"filter":null
	}
	return json
}

function sliderFilter(id){
	console.log(camanParameter[id])
	$.each(camanParameter[id],function(index,value){
		if(index!="filter"){
			$(".clickable .modal-form div.FilterSetting>input[data-filter="+index+"]").val(value)
			$("input[data-filter="+index+"]").closest("div.FilterSetting").find("span.FilterValue").html(value);
		}
		else{
			$("div#PresetFilters>a[data-preset="+value+"]").addClass("Active");
		}
	});
}

function changePhoto(json,key,value){

	if(key=="gamma" && value==0){
		value=1
	}
	json[key]=value
	return json
}

function setArray(array,id){
	let source_canvas = $(".queue-item[data-id=" + id + "] .preview .canvas")[0];
	let newCanvas=$('<canvas/>', {
			'class': 'canvas',
			'data-caman-hidpi-disabled':true
		})[0];

	if(CHV.fn.uploader.files[id].url===undefined){
		newCanvas.width = source_canvas.width;
		newCanvas.height = source_canvas.height;
		var newCanvas_ctx = newCanvas.getContext('2d');
		newCanvas_ctx.drawImage(source_canvas, 0, 0);
	}
	else{
		var URL=CHV.fn.uploader.files[id].url
		if(!('url' in CHV.fn.uploader.files[id].parsedMeta))
			window.postMessage({url: URL}, '*');
		newCanvas=0
		// var target_canvas = $(".image-preview .canvas", modal)[0],
		//     img = new Image(),
		//     base64 = '' ;
	 //    newCanvas.width = CHV.fn.uploader.files[id].parsedMeta.width
	 //    newCanvas.height = CHV.fn.uploader.files[id].parsedMeta.height
		// var newCanvas_ctx = newCanvas.getContext('2d');
		// var CORS = 'https://crossorigin.me/'
		// var URL = CHV.fn.uploader.files[id].url
		// img.setAttribute("crossOrigin",'Anonymous')
		// img.src = CORS + URL
		// img.onload = function(){
		//     newCanvas_ctx.drawImage(img,0,0)
		//  }
	}
	array[id]=newCanvas;
	return array;

}


