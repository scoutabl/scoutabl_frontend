import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import SiriWave from 'siriwave';

export default function VideoRecorder() {
    const webcamRef = useRef(null);
    const siriWaveRef = useRef(null);
    const audioContextRef = useRef(null);
    const [attemptsLeft, setAttemptsLeft] = useState(2);
    const [recording, setRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

    useEffect(() => {
        siriWaveRef.current = new SiriWave({
            container: document.getElementById('siri-container'),
            style: 'ios9',
            speed: 0.2,
            amplitude: 0,
            autostart: true,
        });

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateWave = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                const amplitude = Math.min(avg / 10, 1);
                siriWaveRef.current.setAmplitude(amplitude);
                requestAnimationFrame(updateWave);
            };

            updateWave();
        });
    }, []);

    useEffect(() => {
        if (!recording) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setRecording(false);
                    clearInterval(timer);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [recording]);

    const handleRetry = () => {
        setTimeLeft(120);
        setRecording(false);
        setAttemptsLeft(prev => Math.max(prev - 1, 0));
    };

    const handleRecord = () => {
        setTimeLeft(120);
        setRecording(true);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <div className="relative w-72 h-72 overflow-hidden rounded-xl">
                <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover" />
            </div>

            <div id="siri-container" className="w-full h-20" />

            <div className="flex items-center justify-between w-full text-gray-700 px-2">
                <span>{attemptsLeft} attempts remaining</span>
                <span className="font-semibold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} mins</span>
            </div>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleRetry}
                    className="bg-gray-200 text-black px-4 py-2 rounded-full shadow hover:bg-gray-300"
                >
                    Re-Submit
                </button>
                <button
                    onClick={handleRecord}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full shadow hover:bg-orange-600"
                >
                    Record
                </button>
                <button
                    disabled={!recording || timeLeft === 0}
                    className={`px-4 py-2 rounded-full shadow ${recording && timeLeft > 0 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
