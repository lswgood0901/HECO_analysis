let webcam;

let pauseBox = [];
let recordBtn = [];
let stopBtn = [];
let passengerIcon;
let currentTimeIcon;
let dateIcon;
let savedIcon;
let date = '22.04.04';
let pasengerNum = 100;

let pauseTime = 0;
let totalPausedTime = 0;
let recordTime = '00:00:00';
let recordStart = 0;
let recordPauseStart = 0;

let recordState = 0;

function preload() {
  pauseBox[0] = loadImage('icon/pauseBox.png'); 
  pauseBox[1] = loadImage('icon/pause box_stoped.png');
  recordBtn[0] = loadImage('icon/recordBtn.png');
  recordBtn[1] = loadImage('icon/disabledBtn.png');
  passengerIcon = loadImage('icon/passengerIcon.png');
  currentTimeIcon = loadImage('icon/currentTime.png');
  dateIcon = loadImage('icon/dateIcon.png');
  savedIcon = loadImage('icon/savedIcon.png');
}

function setup() {
  createCanvas(3040, 1440);
  webcam = createCapture(VIDEO);
  webcam.size(3040, 2280);
  webcam.hide();
}

function draw() {
  background(0);
  image(webcam,0,0,3040,2280);
  
  image(dateIcon, 280, 8, 40, 40);
  image(currentTimeIcon, 360, 8, 40, 40);
  image(passengerIcon, 440, 8, 40, 40);
  
  textFont('Roboto');
  textStyle(BOLD);
  textSize(10);
  textAlign(CENTER);
  text(pasengerNum, 440, 50, 40, 12);
  text(currentDate(), 278, 50, 44, 12);
  text(curTime(), 358, 50, 46, 12);
  
  push();
  textSize(12);
  fill(255);
  translate(634,215);
  rotate(radians(270));
  text(recordTime, 0, 0,65,12);
  pop();
  
  print(recordTime);
  getRecordTime();
  if(recordState == 0) {
    image(recordBtn[0], 648, 148, 72, 72);
    
  } else if (recordState == 1) {
    image(pauseBox[0], 654, 116, 60, 148);
    
  } else if (recordState == 2) {
    image(pauseBox[1], 654, 116, 60, 148);
   
  } else if (recordState == 3) {
    image(recordBtn[1], 648, 148, 72, 72);
    
  } else if (recordState == 4) {
    image(recordBtn[0], 648, 148, 72, 72);
    image(savedIcon,673,112,32,20);
    setTimeout(()=>{
      recordState = 0;
    }, 3000);
  }
}


function currentDate() {
  let stringMonth;
  let stringDay;
  if(month()<10){
    stringMonth = '0'+month();
  } else {
    stringMonth = month();
  }
  if(day()<10) {
    stringDay = '0'+day();
  } else {
    stringDay = day();
  }
  let currentDate = nf(year(),2,0)+'.'+nf(month(),2,0)+'.'+nf(day(),2,0); 

  return currentDate
}

function curTime() {
  let curHours;
  if(hour()>12){
    curHours = 'PM '+ int(hour()-12)+':'+minute();
  } else{
    curHours = 'AM' + hour()+':'+minute();
  }
  return curHours
}

function mouseReleased() {
  if(recordState == 0) {
    if(dist(mouseX, mouseY, 684, 180) < 40) {
      
      recordState = 1;
      recordStart = millis();
    }
  } else if (recordState == 1){
    if(dist(mouseX, mouseY, 684, 220) < 20){
      recordState = 2;
      recordPauseStart = millis();
      
      
    } else if (dist(mouseX, mouseY, 684, 160) < 20) {
      recordState = 3;
      initializeTime();
      
      setTimeout(()=>{
        recordState = 4;
      }, 5000);
    }
  } else if (recordState == 2){
    if(dist(mouseX,mouseY, 684,220)<20) {
      recordState = 1;
      totalPausedTime = totalPausedTime+pauseTime;
    } else if (dist(mouseX, mouseY, 684, 160) < 20) {
      recordState = 3;
      initializeTime();
      
      setTimeout(()=>{
        recordState = 4;
      }, 5000);
    }
  }
}


function getRecordTime() {
  let curTime = millis();
  
  if(recordState == 0){
    recordTime="00:00:00"
  } else if (recordState == 1) {
    let tempTime = curTime - recordStart - totalPausedTime;
    let recHour = int(tempTime / (1000*60*60)) % 60;
    let recMin = int(tempTime / (1000*60)) % 60;
    let recSec = int(tempTime / 1000) % 24;
    recordTime = nf(recHour,2,0)+':'+nf(recMin,2,0)+':'+nf(recSec,2,0);
  } else if (recordState == 2){
    pauseTime = millis()-recordPauseStart
  } else if (recordState == 4){
    recordTime="00:00:00"
  }
}

function initializeTime() {
  recordTime = "00:00:00"
  recordPauseStart = 0
  recordStart = 0
  pauseTime = 0;
  totalPausedTime = 0;
}