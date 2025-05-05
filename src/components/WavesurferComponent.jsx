import { useEffect, useRef } from 'react';
import SiriWave from 'siriwave';

const WaveformComponent = ({ isRecording, onRecordingComplete }) => {
  const containerRef = useRef(null);
  const siriWaveRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      siriWaveRef.current = new SiriWave({
        container: containerRef.current,
        style: 'ios',
        width: containerRef.current.clientWidth,
        height: 150,
        autostart: true,
        speed: 0.1,
        amplitude: 0.6,
        frequency: 3,
        color: '#FF63F7',
        cover: true,
        curveDefinition: [
          { attenuation: -2, lineWidth: 1, opacity: 0.1 },
          { attenuation: -6, lineWidth: 1, opacity: 0.2 },
          { attenuation: 4, lineWidth: 1, opacity: 0.4 },
          { attenuation: 2, lineWidth: 1, opacity: 0.6 },
          { attenuation: 1, lineWidth: 1.5, opacity: 1 }
        ]
      });
    }

    return () => {
      if (siriWaveRef.current) {
        siriWaveRef.current.dispose();
        siriWaveRef.current = null;
      }
    };
  }, [isRecording]);

  return (
    <div className="border-[1px] border-[rgba(224,224,224,0.65)] rounded-[91px] px-[28px] h-[242px] flex items-center justify-center relative">
      {!isRecording ? (
        // Static gradient line when not recording
        <div className="w-full h-[2px] bg-[#FF52B6]" />
      ) : (
        // Animated waves when recording
        <div ref={containerRef} className="w-full h-full" />
      )}

    </div>
  );
};

export default WaveformComponent;