let audioCtx = new AudioContext();
let destination = audioCtx.createMediaStreamDestination();
let myAudio = document.querySelector('audio#song');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');

let streamAudio;
let mediaRecorder;
let recordedBlobs;
let sourceMusic = audioCtx.createMediaElementSource(myAudio);
sourceMusic.connect(audioCtx.destination);
recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
      startRecording();
    } else {
      stopRecording();
      recordButton.textContent = 'Start Recording';
      playButton.disabled = false;
    }
  });

function startRecording () {
    recordedBlobs = [];
    let stream1 = audioCtx.createMediaStreamSource(streamAudio);
    sourceMusic.connect(destination);
    stream1.connect(destination);
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
}

function handleDataAvailable(e) {
    if(e.data && e.data.size > 0) {
        recordedBlobs.push(e.data);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('Media Recorder stopped');
    const blob = new Blob(recordedBlobs, {type: 'audio/ogg'});
    console.log('recordedBlobs: ', recordedBlobs);
    console.log('blob: ', blob)
    const url = URL.createObjectURL(blob);
    let recordedAudio = document.createElement('audio');
    let recordedSource = document.createElement('source');
    recordedAudio.appendChild(recordedSource);
    document.querySelector('body').appendChild(recordedAudio);
    recordedAudio.controls = true;
    recordedSource.src = url;
}

function handleSuccess(stream) {
    recordButton.disabled = false;
    streamAudio = stream;
    console.log(audioCtx.destination)
    console.log(destination)
}

navigator.mediaDevices.getUserMedia({audio:true})
.then(handleSuccess)
.catch((e)=>{
    console.log(e)
})
