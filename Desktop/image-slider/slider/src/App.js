
import { useRef, useState } from 'react';
import './App.css';
// import VideoThumbnail from './videoThumbnail/VideoThumbnail';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'



// const ffmpeg = createFFmpeg();
// const ffmpeg = new FFmpeg();
function App() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const messageRef = useRef(null);
  const [frames , setFrames] = useState([]);




  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      messageRef.current.innerHTML = message;
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setLoaded(true);
  }




  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      videoRef.current.src = url;
    }
  };





  const transcode = async () => {
    const videoUrl = videoRef.current.src;
    console.log('Starting transcoding...');
  
    const ffmpeg = ffmpegRef.current;
    
  
    await ffmpeg.writeFile('./input.avi', await fetchFile(videoUrl));
  
    await ffmpeg.exec(['-i', 'input.avi', 'output.mp4']);
  
    const fileData = await ffmpeg.readFile('output.mp4');
  
    const data = new Uint8Array(fileData);

    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    extractFrames(blob);
  }


  const extractFrames = async (videoBlob) => {
    const ffmpeg = ffmpegRef.current;
  await ffmpeg.load();

  await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));

  // Define the total number of frames you expect to extract
  const totalFrames = 20; 

  // Extract frames
  await ffmpeg.exec(['-i', 'input.mp4', 'output-%03d.png']);

  // Generate frame URLs based on the expected number of frames
  const framePromises = Array.from({ length: totalFrames }, (_, i) => {
    const frameNumber = String(i + 1).padStart(3, '0');
    const fileName = `output-${frameNumber}.png`;
    return ffmpeg.readFile(fileName).then((data) => ({
      id: fileName,
      url: URL.createObjectURL(new Blob([data], { type: 'image/png' })),
    }));
  });

  const frameURLs = await Promise.all(framePromises);
  setFrames(frameURLs);

  // Clean up ffmpeg resources
  // await ffmpeg.remove('input.mp4');
  for (let i = 1; i <= totalFrames; i++) {
    const frameNumber = String(i).padStart(3, '0');
    // await ffmpeg.remove(`output-${frameNumber}.png`);
  }
  };






  return (loaded
    ? (
      <>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
        <video ref={videoRef} controls></video><br />
        <button onClick={transcode}>Transcode webm to mp4</button>
        <p ref={messageRef}></p>
        <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
        <div className="frames-container">
        {frames.map(frame => (
          <img key={frame.id} src={frame.url} alt="Frame" className="frame" />
        ))}
      </div>
      </>
    )
    : (
      <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
    )
  );
}

export default App;
