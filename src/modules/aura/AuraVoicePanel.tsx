import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Voicemail } from 'lucide-react';

const AuraVoicePanel: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch('/api/voice/stt', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (response.ok) {
            setTranscript(result.text);
            // Simulate AI response and play TTS
            playTts(`You said: ${result.text}`);
          } else {
            console.error('STT API error:', result);
            setTranscript('Error transcribing audio.');
          }
        } catch (error) {
          console.error('Error sending audio to STT API:', error);
          setTranscript('Error connecting to STT service.');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setTranscript('Microphone access denied.');
    }
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const playTts = useCallback(async (text: string) => {
    if (isMuted) return;

    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('TTS API error:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching TTS audio:', error);
    }
  }, [isMuted]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isRecording, handleStartRecording, handleStopRecording]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        toggleRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleRecording]);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Aura Voice</h2>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full hover:bg-gray-700"
          aria-label="Toggle Mute"
        >
          {isMuted ? <Voicemail size={24} /> : <Voicemail size={24} />}
        </button>
      </div>
      <div className="mb-4 p-2 bg-gray-900 rounded h-32 overflow-y-auto">
        <p>{transcript || 'Press the button and start speaking...'}</p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          className={`p-4 rounded-full transition-colors ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
      </div>
    </div>
  );
};

export default AuraVoicePanel;
