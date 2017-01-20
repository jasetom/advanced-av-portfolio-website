/*
	Tomas Jasevicius - Advances Audio-Visual Processing
	Project 3 - Audio visualisation using FFT analysis

	References:
	--
	Loading audio file and bootstrap's load bar
	Referenced from http://www.w3schools.com/howto/howto_js_progressbar.asp
	--
	Particles code adapted from: 
	http://lab.hakim.se/trail/03/
	--
	Uploading files to server using nodejs adapted from:
	https://coligo.io/building-ajax-file-uploader-with-node/
	--
	Trigonometry function used to draw hexagons:
	http://stackoverflow.com/a/11354824/4437014
	--
	Default soundtrack used with permission:
	"Action Jackson" by SoulSonic:
	https://coldtearrecords.bandcamp.com/track/action-jackson

*/

//Variables for file upload
var file;
var fl;

//Default audio file and its state
var fileName = 'SoulSonic - Action Jackson.mp3'
var play=false;

//Maximillian variables, initialising maximillian
var maxiAudio = new maximJs.maxiAudio();
var fft = new maximJs.maxiFFT();
var soundTrack = new maximJs.maxiSample();
maxiAudio.init();

//Setting up fft
var fftSize = 1024;
var binFreq = 44100 / fftSize;
var bands = fftSize/2;
fft.setup(fftSize, 512, 256);

//HTML5 Canvas variables
var canvas = document.querySelector("canvas");
var width = 850;
var hlfWidth = width*0.5;
var height = 400;
var hlfHeight = height*0.5;
var context = canvas.getContext("2d");
var size = width / 50;
//Set canvas size 
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

//Animation counter variable 
var animCounter = 1;

//Spacing to draw 5th animation
var spacing = ((Math.PI * 2) / 512);

//Some variables for butterfly particle system
var butterflies;
var radius = 0.2;

//Fnction to load provided soundTrack
function ProvidedSoundTrack(){
	$('#prog').html('File chosen: '+fileName);
	StartLoading(fileName);
}

//Start Loading function is called once we choose the audio file, 
//Latter gets passed into the function and is loaded up using maxim 
function StartLoading(chosenFile) {
	fileName = chosenFile;

	//Loading up chosenFile from location on the server.
	maxiAudio.loadSample(location.protocol + '//' + location.host+'/uploads/'+fileName, soundTrack);

	//Loading up progress bar to show the percentage of status
	//[referenced at the top of the document]
	var width = 1;
	var id = setInterval(frame, 50);

	function frame() {
		if (width>= 100) {
			clearInterval(id);
			$(".next-btn").toggle("slow");
		} else {
			width++; 
			$('.progress-bar').text('Processing sound ' +width+'%');
			$('.progress-bar').width(width + '%'); 
		}
	}
}

//Once called this function sets background to black and music starts playing
function Play(){
	play = true;
	document.body.style.backgroundColor='black';
}


//Hide setup menu, display visualisations and play music.
function ShowCanvas(){
	$('.setup').hide();
	document.querySelector(".showCanvas").style.display = 'block';
	Play();
}

//Button eventhandlers to switch between animations
function PrevAnimation(){
	animCounter--;
}

function NextAnimation(){
	animCounter++;
}


//Play maximillian audio
maxiAudio.play = function() {
	//If play is true and sample is loaded
	if(play){
		if(soundTrack.isReady){
			var sound = soundTrack.play();
			//Play the music track to the speakers
			this.output = sound;
			//If fft processes the sound, pass magnitude of the ffts 
			//to decibels so that it could be used later in visualisations.
			if (fft.process(sound)) {
				fft.magsToDB();
			}
		}    
	}else{
	//do nothing
	}
	   
}

//Function used to draw hexagos in visualisation 4 [referenced at the top of the document]
function drawHexagon(xpos,ypos,size,col){
	//Hexagon has 6 sides
	var numberOfSides = 6; 
	//Begin canvas drawing
	context.beginPath();
	context.moveTo (xpos +  size * Math.cos(0), ypos +  size *  Math.sin(0));          
	//use this combination of trigonometry coordinates to draw hexagons
	for (var i = 1; i <= numberOfSides; i++) {
		context.lineTo (xpos + size * Math.cos(i * 2 * Math.PI / numberOfSides), ypos + size * Math.sin(i * 2 * Math.PI / numberOfSides));
	}
	//apply colour and close path   
	context.fillStyle = col;
	context.fill();
	context.closePath();
}


//Function used to initiate butterflies particle system
//[referenced at the top of the document]
function createButterflies() {
	//empty array
	butterflies = [];

	//create 512 butterflies as that is the number
	//of the bands I chose to be used for my fft.
	for (var i = 0; i < bands; i++) {
	//populate array with an object of butterfly.
		var butterfly = {
			pos: { x: width/2, y: height/2 },   //starting position
			size: 1,                            //starting size
			angle: 0,                           //angle at which it spins
			speed: 0.01+Math.random()*0.04,     //speed at which it flies
			color: '#fff',                      //color
			orbit: radius*.5 + (radius * .5 * Math.random()) //size of an orbit it makes when flying
		};
		//add populated butterflies objects to array for later use. 
		butterflies.push(butterfly);
	}
}

//Function used to draw star shape for visualisation number 5
function drawShape(posx,posy,bandNo,size){
	//how many segments do we want to have
	var segments = 15;
	//spacing between the segments
	var spacing = Math.PI*2 / segments;
	//color
	context.strokeStyle = 'rgba(255,255,255,0.05)';
	//and we begin the drawing
	context.beginPath();
	//we use a modified combination of trigonomtery formulas to get the desired result
	for (var i = 0; i < segments+1; i++) {
		context.lineTo(posx+Math.cos(spacing * fft.getMagnitudeDB(bandNo)) * fft.getMagnitudeDB(bandNo), posy+Math.sin(spacing * fft.getMagnitudeDB(bandNo)) * fft.getMagnitudeDB(bandNo));
		context.lineTo(posx+Math.cos(spacing * i) * size, posy+Math.sin(spacing * i) * size);
	}
	context.stroke();
	context.closePath();
 }

//Function to get random integer from between the specified range
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}


//Initialising butterflies particles
createButterflies();

//Drawing visualisations here
function draw() {
	//Make sure we loop animation counter
	if(animCounter > 7){
		animCounter = 1;
	}else if(animCounter < 1){
		animCounter = 7;
	}
	//change text so the user know which visual they're looking at
	$('#viz').text('FFT visualisations: '+animCounter+'/7')


	if(animCounter==1){
		//this is a very simple visualisation, it gets magintutes for each of the
		//bands in the fft and uses that variable to adjust the size of the arcs
		//which are layed out horizontally.
		context.clearRect(0, 0, width, height);
		for (var i = 0; i < bands; i++) {
			context.beginPath();
			context.arc(20+i*5,hlfHeight,fft.getMagnitudeDB(i)*2,0,Math.PI)
			context.fillStyle = "rgb(153, 0, 51)";
			context.fill();
			context.closePath();
		}

	}else if(animCounter == 2){
		//again, using fft.getMagnituteDB for each of the bands in the fft
		//and draw circles for each of those adjusting the size of each.
		context.clearRect(0, 0, width, height);
		for (var i = 0; i < bands; i++) {
			context.beginPath();
			context.arc(hlfWidth,hlfHeight,fft.getMagnitudeDB(i)*5,0,Math.PI*2)
			context.fillStyle = "rgba(204, 204, 153, 0.2)";
			context.fill();
			context.closePath();
		}

	}else if(animCounter == 3){
		//yet again using the same variable to adjust rectangles sizes
		//and display them in a horizontal way for each of the bands in fft
		//to represent the magnitute of each bands.
		context.clearRect(0, 0, width, height);
		for (var i = 0; i < bands; i++) {
			context.beginPath();
			context.rect(20+i*5,hlfHeight,2,fft.getMagnitudeDB(i)*2);
			context.rect(20+i*5,hlfHeight,2,-(fft.getMagnitudeDB(i)*2));
			context.fillStyle = "rgb(255, 0, 128)";
			context.fill();
			context.closePath();
		}

	}else if(animCounter == 4){
		
	context.clearRect(0, 0, width, height);
	context.beginPath();
	var xpos = 450;
	//we draw lines with magnitude taken from fft. many times.. 
	//this time manually selecting which bands we want to display to get the desired outcome.
	for (var i =0; i< 90; i=i+10){
		context.moveTo(100,hlfHeight+i);
		context.lineTo(xpos,hlfHeight+i);
		context.lineTo(xpos+10,hlfHeight+i);
		context.lineTo(xpos+15,hlfHeight+i+fft.getMagnitudeDB(2));
		context.lineTo(xpos+20,hlfHeight+i);
		context.lineTo(xpos+25,hlfHeight+i+(-fft.getMagnitudeDB(24)));
		context.lineTo(xpos+30,hlfHeight+i);
		context.lineTo(xpos+35,hlfHeight+i+(-fft.getMagnitudeDB(10)));
		context.lineTo(xpos+40,hlfHeight+i);
		context.lineTo(xpos+45,hlfHeight+i+fft.getMagnitudeDB(13));
		context.lineTo(xpos+50,hlfHeight+i);
		context.lineTo(xpos+55,hlfHeight+i+(-fft.getMagnitudeDB(2)));
		context.lineTo(xpos+60,hlfHeight+i);
		context.lineTo(xpos+65,hlfHeight+i+fft.getMagnitudeDB(5));
		context.lineTo(xpos+70,hlfHeight+i);
		context.lineTo(xpos+75,hlfHeight+i+(-fft.getMagnitudeDB(6)));
		context.lineTo(xpos+80,hlfHeight+i);
		context.lineTo(xpos+85,hlfHeight+i+(-fft.getMagnitudeDB(7)));
		context.lineTo(xpos+90,hlfHeight+i);
		context.lineTo(xpos+95,hlfHeight+i+(-fft.getMagnitudeDB(8)));
		context.lineTo(xpos+100,hlfHeight+i);
		context.lineTo(xpos+105,hlfHeight+i+(-fft.getMagnitudeDB(9)));
		context.lineTo(xpos+110,hlfHeight+i);
		context.lineTo(xpos+115,hlfHeight+i+(fft.getMagnitudeDB(20)));
		context.lineTo(xpos+120,hlfHeight+i);
		context.lineTo(xpos+125,hlfHeight+i+(-fft.getMagnitudeDB(3)));
		context.lineTo(xpos+130,hlfHeight+i);
		context.lineTo(xpos+135,hlfHeight+i+(-fft.getMagnitudeDB(1)));
		context.lineTo(xpos+140,hlfHeight+i);
		context.lineTo(xpos+145,hlfHeight+i+(fft.getMagnitudeDB(16)));
		context.lineTo(xpos+150,hlfHeight+i);
		context.lineTo(xpos+155,hlfHeight+i+(-fft.getMagnitudeDB(17)));
		context.lineTo(xpos+160,hlfHeight+i);
		context.lineTo(xpos+165,hlfHeight+i+(fft.getMagnitudeDB(21)));
		context.lineTo(xpos+170,hlfHeight+i);
		context.lineTo(xpos+175,hlfHeight+i+(-fft.getMagnitudeDB(13)));
		context.lineTo(xpos+180,hlfHeight+i);
		context.lineTo(xpos+185,hlfHeight+i+(fft.getMagnitudeDB(4)));
		context.lineTo(xpos+190,hlfHeight+i);
		context.lineTo(xpos+195,hlfHeight+i+(-fft.getMagnitudeDB(44)));
		context.lineTo(xpos+200,hlfHeight+i);
		context.lineTo(xpos+205,hlfHeight+i+(fft.getMagnitudeDB(33)));
		context.lineTo(xpos+210,hlfHeight+i);
		context.lineTo(xpos+215,hlfHeight+i+(fft.getMagnitudeDB(25)));
		context.lineTo(xpos+220,hlfHeight+i);
		context.lineTo(xpos+225,hlfHeight+i+(-fft.getMagnitudeDB(4)));
		context.lineTo(xpos+230,hlfHeight+i);
		context.lineTo(xpos+235,hlfHeight+i+(-fft.getMagnitudeDB(8)));
		context.lineTo(xpos+240,hlfHeight+i);
		context.lineTo(xpos+250,hlfHeight+i+(fft.getMagnitudeDB(2)));
		context.lineTo(xpos+260,hlfHeight+i);
		context.lineTo(xpos+400,hlfHeight+i);
		context.lineTo(xpos+450,hlfHeight+i);
	}
	context.strokeStyle = "white";
	context.stroke();
	context.closePath();

	}else if(animCounter == 5){
		//using function to draw trig shapes for each of the bands
		canvas.width = canvas.width;
		for (var i = 0; i < bands; i++) {
			drawShape(width/2,height/2,i,200);
		}

	}else if(animCounter == 6){

	//again using the fft bands to draw hexagon shapes which react to 
	//magnitudes of each
	context.clearRect(0, 0, width, height);
	for (var i = 0; i < bands; i++) {
		if(i<=5){
			drawHexagon(getRandomInt(40,width),getRandomInt(fft.getMagnitudeDB(i)*10,60+fft.getMagnitudeDB(i)),fft.getMagnitudeDB(i),'rgb(255,255,255)');
		}else if(i>5 && i<15){
			drawHexagon(getRandomInt(50,width),getRandomInt(fft.getMagnitudeDB(i)*10,40+fft.getMagnitudeDB(i)),fft.getMagnitudeDB(i),'rgba(0,255,0,0.5)');
		}else if(i>55 && i<70){
			drawHexagon(getRandomInt(50,width),getRandomInt(fft.getMagnitudeDB(i)*10,20+fft.getMagnitudeDB(i)),fft.getMagnitudeDB(i),'rgba(255,0,0,0.5)');
		}else{
			drawHexagon(getRandomInt(50,width),getRandomInt(fft.getMagnitudeDB(i)*10,10+fft.getMagnitudeDB(i)),fft.getMagnitudeDB(i),'rgba(0,0,0,255,0.5)');
		}
	}
	}else if(animCounter == 7){

		//lastly I set up some parameters for butterflies particle system to be responsive
		//to the audio, again using the same getMagnitudeDB function
		context.clearRect(0, 0, width, height);
		for (var i = 0 ;i < butterflies.length; i++) {
			//start position in the center of the canvas.
			var startPos = { x: butterflies[i].pos.x, y: butterflies[i].pos.y };
			//set speed to be respondant to fft magnitude of Decibels
			butterflies[i].speed = fft.getMagnitudeDB(i)*0.2;
			//offset the angle to keep the spin of the butterflies going
			butterflies[i].angle += butterflies[i].speed*10;
			//apply position for each of the butterflies using fft variables
			butterflies[i].pos.x = butterflies[i].pos.x + Math.cos(i + butterflies[i].angle) * (butterflies[i].orbit*fft.getMagnitudeDB(i)*5);
			butterflies[i].pos.y = butterflies[i].pos.y + Math.sin(i + butterflies[i].angle) * (butterflies[i].orbit*fft.getMagnitudeDB(i)*5);
			//limit butterflies positions to the canvas size
			butterflies[i].pos.x = Math.max( Math.min( butterflies[i].pos.x, width ), 0 );
			butterflies[i].pos.y = Math.max( Math.min( butterflies[i].pos.y, height ), 0 );
			//set size of each butterfly depending on the magnitute in DB coresponding to band
			butterflies[i].size = fft.getMagnitudeDB(i)*0.7;
			//after all interaction has been set, we use canvas elements to draw butterflies
			context.beginPath();
			context.fillStyle = butterflies[i].color;
			context.strokeStyle = butterflies[i].color;
			context.lineWidth = butterflies[i].size;
			context.moveTo(startPos.x, startPos.y);
			context.lineTo(butterflies[i].pos.x, butterflies[i].pos.y);
			context.stroke();
			context.closePath();
		}
	}else{
		//if there are no animations, keep canvas empty
		context.clearRect(0, 0, width, height);
	}
}

//Loop draw function every 10ms to make the animations 'alive'.
setInterval(draw, 10);
