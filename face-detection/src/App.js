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
    navigator.getUserMedia(
      { video: {} },
      stream => (webcamRef.current.srcObject = stream)

    );
  }

    
}
export default App;