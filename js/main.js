let audioCtx = new AudioContext();
let destination = audioCtx.createMediaStreamDestination();
let myAudio = document.querySelector('audio#song');
let myVideo = document.querySelector('video#video');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');

let streamAudio;
let mediaRecorder;
let recordedBlobs;
let sourceMusic = audioCtx.createMediaElementSource(myAudio);
let sourceVideo = audioCtx.createMediaElementSource(myVideo);

let recordedAudio = document.querySelector('#recordedAudio');
sourceMusic.connect(audioCtx.destination);
sourceVideo.connect(audioCtx.destination);

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
      startRecording();
    } else {
      stopRecording();
      recordButton.textContent = 'Start Recording';
      playButton.disabled = false;
      downloadButton.disabled = false;
    }
  });
playButton.addEventListener('click', () => {
    recordedAudio.play();
})
function startRecording () {
    recordedBlobs = [];
    let pcAudioStream = audioCtx.createMediaStreamSource(streamAudio);
    sourceMusic.connect(destination);
    sourceVideo.connect(destination);
    pcAudioStream.connect(destination);
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
    const blob = new Blob(recordedBlobs, {type: 'audio/mp3'});
    console.log('recordedBlobs: ', recordedBlobs);
    console.log('blob: ', blob)
    const url = URL.createObjectURL(blob);
    recordedAudio.src = url;
    const downloadLink = downloadButton.querySelector('a');
    downloadLink.href = url;
    downloadLink.download = 'test.mp3';
}

function handleSuccess(stream) {
    recordButton.disabled = false;
    streamAudio = stream;
    console.log("Successfully access to microphone");
}

navigator.mediaDevices.getUserMedia({audio:true})
.then(handleSuccess)
.catch((e)=>{
    console.log(e)
})
