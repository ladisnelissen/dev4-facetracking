import React, {useRef, useState, useEffect} from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';


function App() {
  const videoHeight = 480;
  const videoWidth = 640;
  const [initializing, setInitializing] = useState(false);
  const webcamRef = useRef();
  const canvasRef = useRef();
 
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo);
    }
    loadModels();
  }
  ,[])

  const startVideo = () => {
    navigator.getUserMedia({
      video: {}
    }, stream => webcamRef.current.srcObject = stream, err => console.log(err))
    
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (initializing) {
        setInitializing(false);
      }
      const detections = await faceapi.detectAllFaces(webcamRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

      console.log(detections);
    }, 100)
  }


  return (
    <div className="App">

      <span>{initializing ? 'Initializing' : 'Ready'}</span>
      <video ref = {webcamRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay}/>
      <canvas ref = {canvasRef} style={{position: "absolute", top: "0px", left: "0px"}}/>
    </div>

  );
    
}
export default App;