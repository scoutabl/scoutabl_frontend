import React, { useEffect, useRef, useState } from 'react';
import SiriWave from 'siriwave';
import { cn } from '@/lib/utils';
import reSubmitIcon from '/retryBtn.svg'
import recordBtnIcon from '/recordBtn.svg'
import stopRecordingBtnIcon from '/stopRecordingBtn.svg'
import submitRecordingBtnIcon from '/recordSubmitBtn.svg'
export default function VideoRecorder({ onSubmitVideo }) {
    const [recordedBlob, setRecordedBlob] = useState(null);
    const videoRef = useRef(null);
    const siriWaveRef = useRef(null);
    const audioContextRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const [attemptsLeft, setAttemptsLeft] = useState(2);
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [recordedVideoURL, setRecordedVideoURL] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [error, setError] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        // Clean up any existing canvas elements in the container
        const container = document.getElementById('siri-container');
        if (container) {
            // Remove any existing canvas elements
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        // Initialize SiriWave with better parameters
        siriWaveRef.current = new SiriWave({
            container: document.getElementById('siri-container'),
            style: 'ios9',
            speed: 0.3,
            amplitude: 2.5,
            width: document.getElementById('siri-container').clientWidth,
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

        // Initialize camera and microphone
        const initCamera = async () => {
            setError(null);

            try {
                console.log("Attempting to access camera and microphone");
                let mediaStreamObj = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });

                setUpVideoStream(mediaStreamObj);
                // Setup audio visualization regardless
                setupAudioVisualization(mediaStreamObj);
            } catch (err) {
                console.error("First camera access attempt failed:", err.name, err.message);

                try {
                    // Try another set of constraints
                    console.log("Attempting with simplified constraints");
                    let mediaStreamObj = await navigator.mediaDevices.getUserMedia({
                        audio: true, // Still try with audio
                        video: { facingMode: "user" }
                    });

                    setUpVideoStream(mediaStreamObj);
                } catch (fallbackErr) {
                    console.error("All camera access attempts failed:", fallbackErr.name, fallbackErr.message);
                    setError(`Camera error: ${fallbackErr.message}. Make sure no other applications are using your camera.`);
                }
            }
        };

        const setUpVideoStream = (mediaStreamObj) => {
            mediaStreamRef.current = mediaStreamObj;
            const video = videoRef.current;

            if (video) {
                // Set video source
                try {
                    if ("srcObject" in video) {
                        video.srcObject = mediaStreamObj;
                    } else {
                        // Fallback for older browsers
                        video.src = window.URL.createObjectURL(mediaStreamObj);
                    }

                    video.onloadedmetadata = async () => {
                        try {
                            await video.play();
                            console.log("Video is playing");
                            setCameraReady(true);
                        } catch (playError) {
                            console.error("Error playing video:", playError);
                            setError(`Error playing video: ${playError.message}`);
                        }
                    };

                    // Sometimes adding a background color helps with visibility
                    if (video.parentElement) {
                        video.parentElement.style.backgroundColor = "black";
                    }
                } catch (e) {
                    console.error("Error setting up video:", e);
                    setError(`Error setting up video: ${e.message}`);
                }
            } else {
                console.error("Video element not found");
                setError("Video element not found");
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

        initCamera();

        // Cleanup function
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                console.log("Camera tracks stopped on cleanup");
            }

            // Also clean up SiriWave
            if (siriWaveRef.current) {
                siriWaveRef.current.stop();
                // Remove any canvas elements
                const container = document.getElementById('siri-container');
                if (container) {
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                }
            }
        };
    }, []);

    useEffect(() => {
        if (!recording) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    handleStopRecording();
                    clearInterval(timer);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [recording]);

    useEffect(() => {
        if (siriWaveRef.current) {
            if (recording) {
                siriWaveRef.current.start();
            } else {
                siriWaveRef.current.stop();
            }
        }
    }, [recording]);

    const handleRetry = () => {
        setTimeLeft(120);
        setRecording(false);
        setAttemptsLeft(prev => Math.max(prev - 1, 0));
        setRecordedVideoURL(null);
        setChunks([]);
        setError(null);
    };

    const handleRecord = async () => {
        if (!mediaStreamRef.current) {
            setError("Camera not available. Please refresh and try again.");
            return;
        }

        try {
            setTimeLeft(120);
            setRecording(true);
            setRecordedVideoURL(null);
            setChunks([]);

            // Start the SiriWave animation when recording begins
            if (siriWaveRef.current) {
                siriWaveRef.current.start();
            }

            // Try different MIME types if needed
            let options = { mimeType: 'video/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/mp4' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options = {};
                }
            }

            const mediaRecorder = new MediaRecorder(mediaStreamRef.current, options);
            mediaRecorderRef.current = mediaRecorder;
            let localChunks = [];

            mediaRecorder.ondataavailable = (ev) => {
                if (ev.data && ev.data.size > 0) {
                    localChunks.push(ev.data);
                }
            };

            mediaRecorder.onstop = () => {
                if (localChunks.length === 0) {
                    setError("No video data was recorded");
                    return;
                }

                const blob = new Blob(localChunks, { type: options.mimeType || 'video/webm' });
                setChunks([]);
                setRecordedBlob(blob); // Store the blob
                setRecordedVideoURL(window.URL.createObjectURL(blob));
            };

            mediaRecorder.start(200);
        } catch (err) {
            console.error("Error starting recording:", err);
            setError(`Recording error: ${err.message}`);
            setRecording(false);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                // Request data first, then stop the recording
                mediaRecorderRef.current.requestData();

                // Stop the SiriWave animation when recording ends
                if (siriWaveRef.current) {
                    siriWaveRef.current.stop();
                }

                // Small delay to ensure data is requested before stopping
                setTimeout(() => {
                    mediaRecorderRef.current.stop();
                    setRecording(false);
                    // Show the preview modal after stopping
                    setShowPreviewModal(true);
                }, 100);
            } catch (err) {
                console.error("Error stopping recording:", err);
                setError(`Error stopping recording: ${err.message}`);
                setRecording(false);
            }
        } else {
            setRecording(false);
        }
    };

    const handleSubmit = () => {
        handleStopRecording();
        // Call the onSubmitVideo prop with the recorded blob if it exists
        if (recordedBlob && typeof onSubmitVideo === 'function') {
            onSubmitVideo(recordedBlob);
        }
    };

    const handleRetryCamera = async () => {
        // First stop any existing tracks
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }

        setError("Reconnecting camera...");

        try {
            // Try with very simple constraints
            const mediaStreamObj = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });

            mediaStreamRef.current = mediaStreamObj;
            const video = videoRef.current;

            if (video) {
                video.srcObject = mediaStreamObj;
                video.onloadedmetadata = async () => {
                    try {
                        await video.play();
                        setCameraReady(true);
                        setError(null);
                    } catch (e) {
                        setError(`Failed to play video: ${e.message}`);
                    }
                };
            }
        } catch (err) {
            setError(`Camera reconnection failed: ${err.message}. Try reloading the page.`);
        }
    };

    // Add a function to close the preview modal
    const closePreviewModal = () => {
        setShowPreviewModal(false);
    };

    // Function to use the recording and close modal
    const useRecording = () => {
        closePreviewModal();
        if (recordedBlob && typeof onSubmitVideo === 'function') {
            onSubmitVideo(recordedBlob);
        }
    };

    return (
        <div className="flex flex-col w-full h-full items-center gap-4">
            <div className="relative w-full h-[484px] overflow-hidden rounded-xl bg-black">
                {error && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
                        <p className="text-red-400 text-center mb-2">{error}</p>
                        <button
                            onClick={handleRetryCamera}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 mt-2"
                        >
                            Reconnect Camera
                        </button>
                    </div>
                )}
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain md:object-cover"
                    autoPlay
                    playsInline
                    muted
                />
            </div>

            <div className="flex items-center justify-between w-full bg-white rounded-lg p-2 mb-2 border border-gray-100">
                <div id="siri-container" className="w-3/4 h-[85px] bg-white" />
                <span className="font-semibold text-right w-1/4 pr-2">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} mins
                </span>
            </div>

            <div className='flex flex-col gap-3 items-center justify-center'>
                <span className='text-center'>{attemptsLeft} attempts remaining</span>
                <div className="flex gap-12 justify-center w-full">
                    <button
                        onClick={handleRetry}
                        className="flex flex-col gap-2 items-center justify-center text-greyAccent"
                    >
                        <img src={reSubmitIcon} alt='retry Icon' className='h-[52px] w-[52px]' />
                        Re-Submit
                    </button>
                    <button
                        onClick={recording ? handleStopRecording : handleRecord}
                        disabled={error}
                        className="flex flex-col gap-2 items-center justify-center text-greyAccent"
                    >
                        {recording ? <img src={stopRecordingBtnIcon} alt='Stop Recording Icon' /> : <img src={recordBtnIcon} alt='Record Icon' />}
                        {recording ? 'Stop' : 'Record'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!recordedVideoURL}
                        className="flex flex-col gap-2 items-center justify-center text-greyAccent"
                    >
                        <img src={submitRecordingBtnIcon} alt='Stop Recording Icon' />
                        Submit
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreviewModal && recordedVideoURL && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3">
                    <div className="bg-white rounded-lg p-3 md:p-4 max-w-2xl w-full mx-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base md:text-lg font-semibold">Video Preview</h3>
                            <button
                                onClick={closePreviewModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Video container with aspect ratio */}
                        <div className="relative w-full rounded overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                            <video
                                src={recordedVideoURL}
                                controls
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                autoPlay
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => {
                                    closePreviewModal();
                                    handleRetry();
                                }}
                                className="px-3 py-1 md:px-4 md:py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Re-Record
                            </button>
                            <button
                                onClick={useRecording}
                                className="px-3 py-1 md:px-4 md:py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Use This Recording
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
