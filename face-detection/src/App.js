import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';


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
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]).then(startVideo);
    };
    loadModels();
  }, []);

  const startVideo = () => {
   navigator.getUserMedia(
      { video: {} },
      stream => (webcamRef.current.srcObject = stream),

      err => console.error(err)
    );
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (initializing) {
        setInitializing(false);
      }
      const displaySize = { width: videoWidth, height: videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(webcamRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

      console.log(detections);

      const emotions = ['happy', 'sad', 'angry', 'disgusted', 'surprised', 'neutral'];

    // Update emotion percentages
    if (detections[0]) {
      emotions.forEach(emotion => {
        const percentage = (detections[0].expressions[emotion] * 100).toFixed(2);
        document.querySelector(`.${emotion}`).innerHTML = `${capitalizeFirstLetter(emotion)}: ${percentage}%`;
      });
    }

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }




    }, 100);
  };

  return (
    <div className="App">
      <span>{initializing ? 'Initializing' : 'Ready'}</span>
      <div className="display-flex justify-content-center">
        <video ref={webcamRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
        <canvas ref={canvasRef} className="position-absolute" style={{ top: 20, left: 445 }} />
      </div>
      <div class = "emotions">
        <p class="happy"></p>
        <p class="sad"></p>
        <p class="angry"></p>
        <p class="disgusted"></p>
        <p class="surprised"></p>
        <p class="neutral"></p>
      </div>
    </div>
  );
}

export default App;
