
//code used to upload audio file to server, adapted from https://coligo.io/building-ajax-file-uploader-with-node/

var badFile;
var fileToUse;

$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileType = file.type.split('/').pop();

      if(fileType == 'mp3' || fileType == 'wav' || fileType == 'mpeg'){
        // add the files to formData object for the data payload
        formData.append('upload', file, file.name);
        badFile = false;
      }else{
        console.log('wrong file')
        badFile = true;
      }

    }
    if(badFile === false){
      $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
               $("#prog").html('File chosen: '+data);
               fileToUse = data;
                // console.log('upload successful!\n');
                // console.log(data);
            },
            xhr: function() {
              // create an XMLHttpRequest
              var xhr = new XMLHttpRequest();
      
              // listen to the 'progress' event
              xhr.upload.addEventListener('progress', function(evt) {
      
                if (evt.lengthComputable) {
                  // calculate the percentage of upload completed
                  var percentComplete = evt.loaded / evt.total;
                  percentComplete = parseInt(percentComplete * 100);

                  // update the Bootstrap progress bar with the new percentage
                  $('.progress-bar').html('uploading '+ percentComplete + '%');
                  $('.progress-bar').width(percentComplete + '%');
      
                  // once the upload reaches 100%, set the progress bar text to done
                  if (percentComplete === 100) {
                    $('.progress-bar').html('Upload done');
                        
                        setTimeout(function(){
                        $('.progress-bar').text('0%');
                        $('.progress-bar').width('0%');
                        StartLoading(fileToUse);
                        },1000);

                  }
      
                }
      
              }, false);
              return xhr;
            }
      });
    }else if(badFile === true){
      $('#prog').html('Wrong file format. Please use .mp3');
    }


}

});