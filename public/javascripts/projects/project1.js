/*
    Tomas Jasevicius - Advances Audio-Visual Processing
    Project 1 - Audio synthesis
    A simple example which demonstrates audio synthesis using maximillian library.
*/

//maxim variables
var maxiAudio = new maximJs.maxiAudio();
var clock = new maximJs.maxiClock();
maxiAudio.init();
clock.setTicksPerBeat(1);//This sets the number of ticks per beat
clock.setTempo(180);// This sets the tempo in Beats Per Minute

// Initialising some Maxim objects
//sound1
var wave1 = new maximJs.maxiOsc();
var wave2 = new maximJs.maxiOsc();
var wave3 = new maximJs.maxiOsc();
var wave4 = new maximJs.maxiOsc();

//sound2
var wave6 = new maximJs.maxiOsc();
var wave7 = new maximJs.maxiOsc();
var phaser1 = new maximJs.maxiOsc();
var lowfilter1 = new maximJs.maxiFilter();
var wave5 = new maximJs.maxiOsc();
var wave6 = new maximJs.maxiOsc();

//sound3
var phaser2 = new maximJs.maxiOsc();
var lowfilter2 = new maximJs.maxiFilter();
var wave7 = new maximJs.maxiOsc();
var wave8 = new maximJs.maxiOsc();
var wave9 = new maximJs.maxiOsc();

var clock = new maximJs.maxiClock();

//variables for 4 different musical experiments
var soundNo;
var counter1 = 0;
var counter2 = 0;
var counter3 = 0;

var stop1;
var stop2;
var stop3;

//freq
var freq = 0;
var noiseFreq = 0;
var bassFreq = 0;
var loNumb = 0;

//canvas variables
var width = 200;
var height = 20;
var firstCanvas = document.querySelector('#first');
var secondCanvas = document.querySelector('#second');
var thirdCanvas = document.querySelector('#third');
var context;

//draw lines which symbolises timeline
var drawPlayer = function(experimentNo){

    if(experimentNo == 1){
        canvas = firstCanvas;
    }else if(experimentNo == 2){
        canvas = secondCanvas;
    }else if(experimentNo == 3){
        canvas = thirdCanvas;
    }
    //setting canvas sizes
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    
    //choosing 2d
    context = canvas.getContext('2d');
    
    //drawing lines to make it look like its an audio player.
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.fillStyle='#4C5C68';
    context.rect(0,10,200,1);
    context.rect(0,0,2,20);
    context.rect(198,0,2,20);
    context.fill();
    context.closePath();
}



//display time underneath the timeline
function displayTime(counter,exampleNo){
    //bpm is 180, meaning that time in seconds is 180/3
    counter = Math.ceil(counter/3);

    if(counter <10){
        counter = '0'+counter
    }
    document.getElementById('time'+exampleNo).innerHTML = '00:'+counter.toString()+'/00:30';

    }

//draw moving line accross the timeline
function updateLine(canvas,xPos,clear){
    if(canvas == 1){
        canvas = firstCanvas;
    }else if(canvas == 2){
        canvas = secondCanvas;
    }else if(canvas ==3){
        canvas = thirdCanvas;
    }else {
        // do nothing
    }

    //when stopped or hits zero, clear the timeline.
    if(clear == true){
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.fillStyle='#4C5C68';
        context.rect(0,10,200,1);
        context.rect(0,0,2,20);
        context.rect(198,0,2,20);
        context.fill();
        context.closePath();
    }else{
        context = canvas.getContext("2d");
        context.beginPath();
        context.fillStyle="#4C5C68";
        context.rect(xPos,0,2,20);
        context.fill();
        context.closePath();
    }
}
	
//function used to play the sound using buttons    
function playMaxiSound(experimentNo){	
    soundNo = experimentNo;
    play = true;
}

//function used to pause the sound using buttons    
function pauseMaxiSound(experimentNo){  
    soundNo = experimentNo;
    play = false;
}

//function used to stop the sound using buttons    
function stopMaxiSound(experimentNo,counter){  
    soundNo = experimentNo;

    if(soundNo == 1){
        stop1 = true;
    }else if(soundNo == 2){
        stop2 = true;
    }else if(soundNo == 3){
        stop3 = true;
    }

    play = false;
    drawPlayer(soundNo);
}


function map(x,a,b,c,d){
    //adapted from http://stackoverflow.com/questions/345187/math-mapping-numbers
    //if variable of x is between a and b, 
    //we map variable y between c and d
    return y = (x-a)/(b-a) * (d-c) + c; 
}

//draw timeline for each of the experiments.
drawPlayer(1);
drawPlayer(2);
drawPlayer(3);

maxiAudio.play = function() {
    clock.ticker();

    //if we play experiment number 1 do all this:
    if(soundNo == 1){
        if(play === true){
            if (clock.tick) { 
                updateLine(soundNo,map(counter1/3,0,30,0,200));
                displayTime(counter1,soundNo);
                counter1++; 
                stop1 = false;

                //track counter, set different values for frequency
                if(counter1 < 5){
                    freq += 20;
                }else if(counter1 > 5 && counter1 < 15){
                    freq = Math.random();
                }else if(counter1 > 15 && counter1 < 25){
                    freq = Math.random();
                }else if(counter1 > 15 && counter1 < 25){
                    freq = 50 * Math.random();
                }else if(counter1 > 25 && counter1 < 35){
                    freq += 25;
                }else if(counter1 > 45 && counter1 < 60){
                    freq = -20 * Math.random();
                }else if(counter1 > 60 && counter1 <70){
                    freq += Math.random();
                }else if(counter1 > 70 && counter1 <80){
                    freq -= 40 * Math.random();
                }else if(counter1 > 80 && counter1 <90){
                    freq = 200 * Math.random()*5;
                }else if(counter1 > 90){
                    freq = 0;
                    counter1 = 0;             
                    updateLine(soundNo,counter1,true);
                   
                }
            }

            //playing around with various combinations of waves and frequencies.
            var bellwave = wave1.sinewave(400+wave2.sinewave(500)*1000);
            var bass = wave1.sinewave(wave4.sinewave(freq)*200);;
            var ticks = wave2.sawn(freq+wave3.triangle(counter1)*10);

            //output the space allien game sounds 
            this.output = bellwave+bass*ticks *0.00001;

        }else if (play == false && stop1 == true){
            //stop playing
            soundNo = 1;
            counter1 = 0;
            updateLine(soundNo,counter1,true);
            displayTime(counter1,soundNo);
            this.output = 0;
        }else if(play == false){
            //pause playing
            soundNo = 1;
            counter1 = counter1;
            updateLine(soundNo,counter1,false);
            displayTime(counter1,soundNo);
            this.output = 0;
            
        }

    // if we play experiment number 2, do all this:
    }else if(soundNo == 2){
        if(play === true){
            var noiseWave;
            var noiseFreqArray = [50,60,40,35,45];
            if (clock.tick) { 
                updateLine(soundNo,map(counter2/3,0,30,0,200));
                displayTime(counter2,soundNo);
                counter2++; 
                stop2 = false;

                noiseFreq = noiseFreqArray[counter2%2];

                if(counter2 > 90){
                    noiseFreq = 0;
                    counter2 = 0;             
                    updateLine(soundNo,counter2,true);
                }
            }

            //playing around with different filters, wave shapes and mathematical functions to generate this sound
            noiseWave = wave5.sinewave(lowfilter1.lores(noiseFreq/Math.abs(wave6.triangle(counter2)),phaser1.sinewave(0.1)*500,5));
    
            //output generated sound       
            this.output = noiseWave * 2;

        }else if (play == false && stop2 == true){
            //stop playing
            soundNo = 2;
            counter2 = 0;
            noiseFreq = 0;
            updateLine(soundNo,counter2,true);
            displayTime(counter2,soundNo);
            this.output = 0;
        }else if(play == false){
            //pause playing
            soundNo = 2
            noiseFreq = bassFreq;
            counter2 = counter2;
            updateLine(soundNo,counter2,false);
            displayTime(counter2,soundNo);
            this.output = 0;
            
        }
    // if we play experiment number 3, do all this:
    }else if(soundNo == 3){
        if(play === true){
            var bassFreqArray = [50,60,40,30,45];
            if (clock.tick) { 
                updateLine(soundNo,map(counter3/3,0,30,0,200));
                displayTime(counter3,soundNo);
                counter3++;            
                stop3 = false;
                //some if statements to control the choise of the frequencies
                if(counter3 %3 == 0){
                    bassFreq = bassFreqArray[counter3%4];
                    loNumb0 = 1;
                }
                if (counter3 %5 == 0) {
                    bassFreq = bassFreqArray[counter3%2];
                    loNumb = 0.0003
                }else if(counter3 %8 ==0){
                    loNumb = 0.1
                    bassFreq = 30;
                }else if(counter3 > 90){
                    bassFreq = 0;
                    counter3 = 0;             
                    updateLine(soundNo,counter3,true);
                }
            }                               
            //combining various waves and filters to get the desired result.
            bassWave = wave7.sinewave(phaser2.phasor(bassFreq* wave8.triangle(bassFreq)*1000)) + wave9.triangle(lowfilter2.lopass(bassFreq*10,loNumb));       

            //output the generated audio
            this.output = bassWave*3;

        }else if (play == false && stop3 == true){
            //stop playing
            soundNo = 3;
            counter3 = 0;
            updateLine(soundNo,counter3,true);
            displayTime(counter3,soundNo);
            this.output = 0;
        }else if(play == false){
            //pause playing
            soundNo = 3
            counter3 = counter3;
            updateLine(soundNo,counter3,false);
            displayTime(counter3,soundNo);
            
        }
    }
};

