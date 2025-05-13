import { useEffect, useRef, useState } from 'react';
import SiriWave from 'siriwave';

const WaveformComponent = ({ isRecording, onRecordingComplete }) => {
  const containerRef = useRef(null);
  const siriWaveRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    // Clean up any existing canvas elements in the container
    const container = containerRef.current;
    if (container) {
      // Remove any existing canvas elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    // Initialize SiriWave with better parameters
    if (containerRef.current) {
      siriWaveRef.current = new SiriWave({
        container: containerRef.current,
        style: 'ios9',
        speed: 0.3,
        amplitude: 2.5,
        width: containerRef.current.clientWidth,
        height: 85,  // Match your Figma height
        autostart: false,
        cover: true,
        pixelDepth: 0.02,
        lerpSpeed: 0.1,
        globalCompositeOperation: "source-over",
        curveDefinition: [
          { color: "100,100,100", supportLine: true }, // Dark gray support line for white background
          { color: "219, 0, 141" },  // Deep magenta
          { color: "83, 16, 173" },  // Deep purple
          { color: "0, 112, 201" },  // Deep blue
          { color: "222, 35, 132" }, // Raspberry
        ],
        // Increase amplitude and width ranges for better visibility on white background
        ranges: {
          amplitude: [0.9, 2.0],  // Higher values to make waves more visible
          width: [1.8, 3.5],      // Wider waves
          speed: [0.1, 0.3]
        }
      });
    }

    // Initialize audio
    const initAudio = async () => {
      try {
        let mediaStreamObj = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });

        mediaStreamRef.current = mediaStreamObj;
        setupAudioVisualization(mediaStreamObj);
        setupAudioRecording(mediaStreamObj);
      } catch (err) {
        console.error("Microphone access failed:", err.name, err.message);
      }
    };

    const setupAudioVisualization = (stream) => {
      try {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateWave = () => {
          analyser.getByteFrequencyData(dataArray);

          // Calculate average frequency amplitude
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;

          // Much more sensitive amplitude scaling (from 80 to 40)
          const amplitude = Math.min(average / 40, 3);

          // Apply a minimum amplitude to ensure visibility even when quiet
          const finalAmplitude = Math.max(amplitude, 0.8);

          // Update SiriWave amplitude if it exists
          if (siriWaveRef.current) {
            siriWaveRef.current.setAmplitude(finalAmplitude);
          }

          // Continue animation loop
          requestAnimationFrame(updateWave);
        };

        updateWave();
      } catch (e) {
        console.error("Error setting up audio visualization:", e);
      }
    };

    const setupAudioRecording = (stream) => {
      try {
        // Try different MIME types if needed
        let options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'audio/mp4' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = {};
          }
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        let localChunks = [];

        mediaRecorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            localChunks.push(ev.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (localChunks.length === 0) {
            console.error("No audio data was recorded");
            return;
          }

          const blob = new Blob(localChunks, { type: options.mimeType || 'audio/webm' });
          localChunks = [];
          setChunks([]);
          setRecordedAudioURL(window.URL.createObjectURL(blob));

          // Call the callback with the blob
          if (onRecordingComplete) {
            onRecordingComplete(blob);
          }
        };

        // Start recording immediately
        mediaRecorder.start(200);
      } catch (e) {
        console.error("Error setting up audio recording:", e);
      }
    };

    // Only initialize audio and start wave if recording
    if (isRecording) {
      setChunks([]);
      setRecordedAudioURL(null);
      initAudio();

      if (siriWaveRef.current) {
        siriWaveRef.current.start();
      }
    } else {
      // Stop recording if it was running
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      if (siriWaveRef.current) {
        siriWaveRef.current.stop();
      }
    }

    // Cleanup function
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.error("Error stopping media recorder:", e);
        }
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Also clean up SiriWave
      if (siriWaveRef.current) {
        siriWaveRef.current.stop();
        siriWaveRef.current = null;
      }

      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, onRecordingComplete]);

  return (
    <div className="flex flex-col gap-4">
      <div className="border-[1px] border-[rgba(224,224,224,0.65)] rounded-[91px] px-[28px] h-[242px] flex items-center justify-center relative">
        {!isRecording ? (
          // Static gradient line when not recording
          <div className="w-full h-[2px] bg-[#FF52B6]" />
        ) : (
          // Animated waves when recording
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {recordedAudioURL && !isRecording && (
        <div className="p-4 rounded-lg border border-gray-200">
          <audio controls src={recordedAudioURL} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default WaveformComponent;