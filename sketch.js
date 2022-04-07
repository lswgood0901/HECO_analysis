let webcam;
let detector;
let detectedObjects = [];
let myVidoeRec;
let videoFrame;

let myWriter;
let writerMsg='';

let pauseBox = [];
let recordBtn = [];
let stopBtn = [];
let passengerIcon;
let currentTimeIcon;
let dateIcon;
let savedIcon;
let date = '22.04.04';
let pasengerNum = 0;

let pauseTime = 0;
let totalPausedTime = 0;
let recordTime = '00:00:00';
let recordStart = 0;
let recordPauseStart = 0;

let recordState = 0;

function preload() {
  detector = ml5.objectDetector('cocossd');
  
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
  rearSetting = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }
  }
  webcam = createCapture(rearSetting);
  // webcam = createCapture(VIDEO);
  webcam.size(3040, 2280);
  webcam.hide();
  myVideoRec = new P5MovRec();
  detector.detect(webcam, gotDetections);
}

function draw() {
  background(0);
  image(webcam,0,0,3040,2280);
  
  image(dateIcon, 1120, 32, 160, 160);
  image(currentTimeIcon, 1440, 32, 160, 160);
  image(passengerIcon, 1760, 32, 160, 160);
  
  doCOCOSSD();
  
  textFont('Roboto');
  textStyle(BOLD);
  textSize(40);
  textAlign(CENTER);
  text(pasengerNum, 1760, 200, 160, 48);
  text(currentDate(), 1112, 200, 176, 48);
  text(curTime(), 1432, 200, 184, 48);
  
  push();
  textSize(48);
  fill(255);
  translate(2536,860);
  rotate(radians(270));
  text(recordTime, 0, 0,260,48);
  pop();
  
  getRecordTime();
  recordStates(recordState);
  writeLog(recordState);
  pasengerNum = 0;

}


function currentDate() {

  let currentDate = nf(year(),2,0)+'.'+nf(month(),2,0)+'.'+nf(day(),2,0); 

  return currentDate
}

function curTime() {
  let curHours;
  if(hour()>12){
    curHours = 'PM '+ nf(hour()-12,2,0)+':'+nf(minute(),2,0);
  } else{
    curHours = 'AM' + nf(hour(),2,0)+':'+nf(minute(),2,0);
  }
  return curHours
}

function mouseReleased() {
  if(recordState == 0) {
    if(dist(mouseX, mouseY, 2736, 720) < 160) {
      
      recordState = 1;
      recordStart = millis();
      startLog();
      myVideoRec.startRec();
    }
  } else if (recordState == 1){
    if(dist(mouseX, mouseY, 2736, 880) < 80){
      recordState = 2;
      recordPauseStart = millis();  
    } 
    if (dist(mouseX, mouseY, 2736, 640) < 80) {
      recordState = 3;
      initializeTime();
      saveLog();
      myVideoRec.stopRec()
      recordState = 4

    }
  } else if (recordState == 2){
    if(dist(mouseX,mouseY, 2736,880)<80) {
      recordState = 1;
      totalPausedTime = totalPausedTime+pauseTime;
    } else if (dist(mouseX, mouseY, 2736, 640) < 80) {
      recordState = 3;
      initializeTime();
      saveLog();
      myVideoRec.stopRec()
      recordState = 4
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

function recordStates(state) {
  if(state == 0) {
    image(recordBtn[0], 2592, 592, 288, 288);
    
  } else if (state == 1) {
    image(pauseBox[0], 2616, 464, 240, 592);
    
  } else if (state == 2) {
    image(pauseBox[1], 2616, 464, 240, 592);
   
  } else if (state == 3) {
    image(recordBtn[1], 2592, 592, 288, 288);
    
  } else if (state == 4) {
    image(recordBtn[0], 2592, 592, 288, 288);
    image(savedIcon,2692,448,128,80);
    setTimeout(()=>{
      recordState = 0;
    }, 3000);
  }
}

function initializeTime() {
  recordTime = "00:00:00"
  recordPauseStart = 0
  recordStart = 0
  pauseTime = 0;
  totalPausedTime = 0;
}
function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  detectedObjects = results;
  detector.detect(webcam, gotDetections);
}
function doCOCOSSD(){
  let tempMsg='';
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];
    
    if(object.label == 'person'){
      pasengerNum = pasengerNum + 1;
      
      push();
      stroke(255,0,254);
      strokeWeight(2);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      fill(255,0,254);
      textSize(40);
      text(object.label+' '+pasengerNum, object.x, object.y - 5);
      
      let centerX = object.x + (object.width/2);
      let centerY = object.y + (object.height/2);
      strokeWeight(4);
      stroke(255,0,254);
      point(centerX, centerY);
      pop();
      tempMsg = tempMsg+','+pasengerNum+','+centerX+','+centerY;
      //개별 사람마다의 X, Y 좌표값 저장
    }
  }
  let millisTime = int(millis() - recordStart - totalPausedTime);
  writerMsg = ''+recordTime+','+millisTime+','+pasengerNum+''+tempMsg;
  // 현재 레코딩 타임과 함께 tempMsg 저장
}
function startLog(){
  let mm = nf(month(),2,0);
  let dd = nf(day(),2,0);
  let ho = nf(hour(),2,0);
  let mi = nf(minute(),2,0);
  let se = nf(second(),2,0);
  
  let fileName = 'data_'+ mm + dd +'_'+ ho + mi + se+'.csv';
  
  myWriter = createWriter(fileName);
}
function saveLog(){
  myWriter.close();
  myWriter.clear();
}
function writeLog(currentState){
  if(currentState == 1){
    myWriter.print(writerMsg);
  }
}
function mousePressed() {
  console.log("hihihi");
  if(mouseX > 0 && mouseX <100 && mouseY > 0 && mouseY < 100){
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
