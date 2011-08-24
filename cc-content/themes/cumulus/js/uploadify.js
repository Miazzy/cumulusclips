$('document').ready(function() {

    var host = $('[name="uploadify:host"]').attr('content');
    var handler = $('form[name="uploadify"]').attr('action');
    var fileDesc = $('[name="uploadify:fileDesc"]').attr('content');
    var fileExt = $('[name="uploadify:fileExt"]').attr('content');
    var theme = $('[name="uploadify:theme"]').attr('content');
    var token = $('#token').val();
    var limit = $('#limit').val();
    var type = $('#type').val();
    var timestamp = $('#timestamp').val();




    // Initialize Uploadify for video uploads
    $('#upload').uploadify({
        'width'         : 150,
        'height'        : 42,
        'sizeLimit'     : limit,
        'fileDataName'  : 'upload',
        'scriptData'    : {'token':token,'timestamp':timestamp},
        'hideButton'    : true,
        'wmode'         : 'transparent',
        'uploader'      : theme+'/flash/uploadify.swf',
        'script'        : handler,
        'cancelImg'     : theme+'/images/cancel.png',
        'fileDesc'      : fileDesc,
        'fileExt'       : fileExt,
        'onError'       : function(event, queueID, fileObj, errorObj) {

            var node;
            var replacements = {host:host};
            var message = $('#uploadify-message');

            // Determine reason for failure
            if (errorObj.type == 'File Size') {
                node = 'error_uploadify_filesize';
            } else {
                node = 'error_uploadify_system';
            }

            // Retrieve and output corresponding error text from language xml
            var callback = function(data){ displayMessage(0,data); }
            GetText(callback, node, replacements);

        },
        'onComplete': function(event, queueID, fileObj, response, data) {

            // Determine result from server validation
            response = $.parseJSON(response);
            if (response.result == 1) {

                // Perform success actions based on what was being uploaded
                if (type == 'avatar') {
                    displayMessage(1,response.msg);
                    window.scroll(0,0);
                    $('.avatar img').attr('src',response.other);
                } else {
                    top.location.href = host+'/myaccount/upload/complete/';
                }

            } else {
                $('#uploadify-message').html(response.msg).removeClass('success').addClass('error').show();
            }

        }   // END onComplete

    });




    // Attach upload event to upload button
    $('#upload-button').click(function(){
        $('#upload').uploadifyUpload();
        return false;
    });

});