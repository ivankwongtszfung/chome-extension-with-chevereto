
$(document).on("click", anywhere_upload_queue + " [data-action=edit]", function() {
        var $item = $(this).closest("li")
          , $queue = $item.closest("ul")
          , id = $item.data("id")
          , file = CHV.fn.uploader.files[id];
        var modal = PF.obj.modal.selectors.root;
        var queueObject = $.extend({}, file.formValues || file.parsedMeta);
        var injectKeys = ["album_id", "category_id", "nsfw"];
        for (var i = 0; i < injectKeys.length; i++) {
            var key = injectKeys[i];
            if (typeof queueObject[key] == typeof undefined) {
                var $object = $("[name=upload-" + key.replace("_", "-") + "]", CHV.fn.uploader.selectors.root);
                var value = $object.prop($object.is(":checkbox") ? "checked" : "value");
                queueObject[key] = $object.is(":checkbox") ? (value ? "1" : null) : value;
            }
        }
        PF.fn.modal.call({
            type: "html",
            template: $("#anywhere-upload-edit-item").html(),
            callback: function() {
                var imageMaxCfg = {
                    width: CHV.obj.config.image.max_width != 0 ? CHV.obj.config.image.max_width : queueObject.width,
                    height: CHV.obj.config.image.max_height != 0 ? CHV.obj.config.image.max_height : queueObject.height,
                };
                var imageMax = $.extend({}, imageMaxCfg);
                var ratio = queueObject.width / queueObject.height;
                imageMax.width = Math.round(imageMaxCfg.height * ratio);
                imageMax.height = Math.round(imageMaxCfg.width / ratio);
                if (imageMax.height > imageMaxCfg.height) {
                    imageMax.height = imageMaxCfg.height;
                    imageMax.width = Math.round(imageMax.height * ratio);
                }
                if (imageMax.width > imageMaxCfg.width) {
                    imageMax.width = imageMaxCfg.width;
                    imageMax.height = Math.round(imageMax.width / ratio);
                }
                $.each(queueObject, function(i, v) {
                    var name = "[name=form-" + i.replace(/_/g, "-") + "]";
                    var $input = $(name, modal);
                    if (!$input.exists())
                        return true;
                    if ($input.is(":checkbox")) {
                        $input.prop("checked", $input.attr("value") == v);
                    } else if ($input.is("select")) {
                        var $option = $input.find("[value=" + v + "]");
                        if (!$option.exists()) {
                            $option = $input.find("option:first");
                        }
                        $option.prop("selected", true);
                    } else {
                        $input.prop("value", v);
                    }
                    if (i == "width" || i == "height") {
                        var max = imageMax[i];
                        var value = file.parsedMeta[i] > max ? max : file.parsedMeta[i];
                        $input.prop("max", value).data("initial", file.parsedMeta[i]).prop("value", value);
                    }
                });
                if (file.parsedMeta.mimetype !== "image/gif") {
                    $("[ data-content=animated-gif-warning]", modal).remove();
                }
                $(".image-preview", modal).append($('<canvas/>', {
                    'class': 'canvas'
                }));
                var source_canvas = $(".queue-item[data-id=" + id + "] .preview .canvas")[0];
                var target_canvas = $(".image-preview .canvas", modal)[0];
                target_canvas.width = source_canvas.width;
                target_canvas.height = source_canvas.height;
                var target_canvas_ctx = target_canvas.getContext('2d');
                target_canvas_ctx.drawImage(source_canvas, 0, 0);
            },
            confirm: function() {
                if (!PF.fn.form_modal_has_changed()) {
                    PF.fn.modal.close();
                    return;
                }
                var errors = false;
                $.each(["width", "height"], function(i, v) {
                    var $input = $("[name=form-" + v + "]", modal);
                    var input_val = parseInt($input.val());
                    var min_val = parseInt($input.attr("min"));
                    var max_val = parseInt($input.attr("max"));
                    if (input_val > max_val || input_val < min_val) {
                        $input.highlight();
                        errors = true;
                        return true;
                    }
                });
                if (errors) {
                    PF.fn.growl.expirable(PF.fn._s("Check the errors in the form to continue."));
                    return false;
                }
                if (typeof file.formValues == typeof undefined) {
                    file.formValues = {
                        title: null,
                        category_id: null,
                        width: null,
                        height: null,
                        nsfw: null,
                        expiration: null,
                        description: null,
                        album_id: null,
                    };
                }
                $(":input[name]", modal).each(function(i, v) {
                    var key = $(this).attr("name").replace("form-", "").replace(/-/g, "_");
                    if (typeof file.formValues[key] == typeof undefined)
                        return true;
                    file.formValues[key] = $(this).is(":checkbox") ? ($(this).is(":checked") ? $(this).prop("value") : null) : $(this).prop("value");
                });
                CHV.fn.uploader.files[id].formValues = file.formValues;
                return true;
            }
        });
    });


$(document).on("click", "[data-action=upload]", function() {
        $("[data-group=upload], [data-group=upload-queue-ready]", $anywhere_upload).hide();
        $("[data-group=uploading]", $anywhere_upload).show();
        CHV.fn.uploader.queueSize();
        CHV.fn.uploader.canAdd = false;
        $queue_items = $("li", $anywhere_upload_queue);
        $queue_items.addClass("uploading waiting");
        CHV.fn.uploader.timestamp = new Date().getTime();
        CHV.fn.uploader.upload($queue_items.first("li"));
    });




$("li[data-action='top-bar-upload'].pop-btn").click();
CHV.fn.uploader.add({},"https://cdn.pixabay.com/photo/2015/08/19/05/05/http-895558_960_720.jpg")