import React, { useRef, useState } from 'react';

const VideoThumbnail = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      videoRef.current.src = url;
      videoRef.current.load();
      videoRef.current.onloadeddata = () => {
        // Wait for video to be ready before seeking
        videoRef.current.currentTime = 0; // Seek to 1 second for the thumbnail
      };
    }
  };

  const captureThumbnail = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to match the video frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the data URL of the image
    const thumbnailURL = canvas.toDataURL('image/png');
    setThumbnail(thumbnailURL);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <br />
      <video
        ref={videoRef}
        controls
        width="400"
        onSeeked={captureThumbnail} // Capture the thumbnail when seeking is complete
      />
      <br />
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <br />
      {thumbnail && (
        <div>
          <h3>Video Thumbnail</h3>
          <img src={thumbnail} alt="Video Thumbnail" width="200" />
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
