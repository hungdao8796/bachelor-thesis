let audioCtx = new AudioContext();
let destination = audioCtx.createMediaStreamDestination();
let myAudio = document.querySelector('audio#song');
let myVideo = document.querySelector('video#video');
const callButton = document.querySelector('button#call');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');

const musicVolume = document.querySelector('#musicVolume');
const videoSoundVolume = document.querySelector('#videoSoundVolume');
const audioStreamVolume = document.querySelector('#audioStreamVolume');

musicVolume.addEventListener('keypress', function (e) {
    e.preventDefault();
});
musicVolume.addEventListener('click', function (e) {
    sourceMusicGainNode.gain.value = musicVolume.value;
});

let pcAudioStream;
let streamAudio;
let mediaRecorder;
let recordedBlobs;
let sourceMusic = audioCtx.createMediaElementSource(myAudio);
let sourceMusicGainNode = audioCtx.createGain();
let sourceVideo = audioCtx.createMediaElementSource(myVideo);

let recordedAudio = document.querySelector('#recordedAudio');
sourceMusic.connect(sourceMusicGainNode);
sourceMusicGainNode.connect(audioCtx.destination);
sourceVideo.connect(audioCtx.destination);
sourceMusic.connect(destination);
sourceVideo.connect(destination);
callButton.addEventListener('click', () => {
    if (callButton.textContent.trim() === 'Start Calling') {
        startCalling();
    } else {
        stopCalling();
    }
});

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
      startRecording();
    } else {
      stopRecording();
    }
});

playButton.addEventListener('click', () => {
    recordedAudio.play();
});

downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, {type: 'audio/ogg'});
    const url = window.URL.createObjectURL(blob);  
    const a = document.createElement("a");  
     a.style.display ="none";  
     a.href = url;  
     a.download = "test";  
     document.body.appendChild(a);  
     a.click();  
     setTimeout(() => {  
         document.body.removeChild(a);  
         window.URL.revokeObjectURL(url);  
     }, 100);
});

function startRecording () {
    recordedBlobs = [];
    
    try {
        mediaRecorder = new MediaRecorder(destination.stream, {});
    } catch (e) {
        console.log(e)
    }
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
    console.log('MediaRecorder started')
}

function handleStop(e) {
    console.log('Recorder stopped: ', e);   
    const blob = new Blob(recordedBlobs, {type: 'audio/ogg'});
    console.log('recordedBlobs: ', recordedBlobs);
    console.log('blob: ', blob)
    const url = URL.createObjectURL(blob);
    recordedAudio.src = url;
}

function handleDataAvailable(e) {
    if(e.data && e.data.size > 0) {
        recordedBlobs.push(e.data);
        console.log(e.data);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('Media Recorder stopped');
    
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
}
function handleSuccess(stream) {
    recordButton.disabled = false;
    streamAudio = stream;
    console.log("Successfully access to microphone");
    pcAudioStream = audioCtx.createMediaStreamSource(streamAudio);
    pcAudioStream.connect(destination);
}

function startCalling() {
    navigator.mediaDevices.getUserMedia({audio:true})
    .then(handleSuccess)
    .catch((e)=>{
        document.getElementById('err').textContent = e.message;
        console.log(e)
    })
    callButton.textContent = 'Stop Calling';
    console.log('Start Calling');
}

function stopCalling() {
    let tracks = streamAudio.getTracks();
    tracks.forEach((track) => {
        track.stop();
    });
    callButton.textContent = 'Start Calling';
    recordButton.disabled = true;
    console.log('Stop Calling')
}
