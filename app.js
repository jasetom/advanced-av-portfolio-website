var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var maximJs = require('./public/javascripts/maxiLib.js');
var badFile = false;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/index.html', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/project1.html', function(req, res){
  res.sendFile(path.join(__dirname, 'views/project1.html'));
});

app.get('/project2.html', function(req, res){
  res.sendFile(path.join(__dirname, 'views/project2.html'));
});

app.get('/project3.html', function(req, res){
  res.sendFile(path.join(__dirname, 'views/project3.html'));
});

app.get('/project4.html', function(req, res){
  res.sendFile(path.join(__dirname, 'views/project4.html'));
});


app.get('/project5.html', function(req, res){
  res.sendFile(path.join(__dirname, 'views/project5.html'));
});

app.get('/project5js.html', function(req, res){
  res.sendFile(path.join(__dirname, 'public/javascripts/projects/project5js.html'));
});

//code used to upload audio file, adapted from https://coligo.io/building-ajax-file-uploader-with-node/
app.post('/upload', function(req, res){	
	var fileName;

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we do not want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/public/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
  	fileName = file.name;
	fs.rename(file.path, path.join(form.uploadDir, file.name));  
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
 	res.end(fileName);
    
  });

  // parse the incoming request containing the form data and select audio file
  form.parse(req, function(err, fields, files){
	});

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});

