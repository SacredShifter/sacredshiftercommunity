import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface WebRTCConnection {
  userId: string;
  peerConnection: RTCPeerConnection;
  audioElement?: HTMLAudioElement;
}

interface UseWebRTCProps {
  roomId: string;
  userId: string;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onAudioReceived?: (userId: string, stream: MediaStream) => void;
}

export const useWebRTC = ({
  roomId,
  userId,
  onUserJoined,
  onUserLeft,
  onAudioReceived
}: UseWebRTCProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const connectionsRef = useRef<Map<string, WebRTCConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // ICE servers configuration for STUN/TURN
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  // Initialize WebRTC connection
  const createPeerConnection = useCallback((targetUserId: string) => {
    const peerConnection = new RTCPeerConnection({ iceServers });
    
    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      onAudioReceived?.(targetUserId, remoteStream);
      
      // Create audio element for playback
      const audioElement = new Audio();
      audioElement.srcObject = remoteStream;
      audioElement.autoplay = true;
      audioElement.volume = 0.8;
      
      const connection = connectionsRef.current.get(targetUserId);
      if (connection) {
        connection.audioElement = audioElement;
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          targetUserId,
          fromUserId: userId
        }));
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${targetUserId}:`, peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'connected') {
        setConnectedUsers(prev => [...prev.filter(id => id !== targetUserId), targetUserId]);
        onUserJoined?.(targetUserId);
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        setConnectedUsers(prev => prev.filter(id => id !== targetUserId));
        onUserLeft?.(targetUserId);
      }
    };

    return peerConnection;
  }, [userId, onUserJoined, onUserLeft, onAudioReceived]);

  // Initialize local media stream
  const initializeLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: false
      });
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      
      // Apply audio processing for consciousness-aware audio
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const filter = audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 300; // Remove low frequency noise
      
      source.connect(filter);
      
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone for voice chat');
      throw error;
    }
  }, []);

  // WebSocket connection for signaling
  const initializeWebSocket = useCallback(() => {
    const ws = new WebSocket(`wss://${window.location.host}/api/webrtc-signaling`);
    
    ws.onopen = () => {
      console.log('WebSocket connected for WebRTC signaling');
      ws.send(JSON.stringify({
        type: 'join-room',
        roomId,
        userId
      }));
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'user-joined':
          console.log('User joined room:', data.userId);
          if (data.userId !== userId) {
            // Create offer for new user
            const peerConnection = createPeerConnection(data.userId);
            connectionsRef.current.set(data.userId, {
              userId: data.userId,
              peerConnection
            });
            
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            ws.send(JSON.stringify({
              type: 'offer',
              offer,
              targetUserId: data.userId,
              fromUserId: userId
            }));
          }
          break;
          
        case 'offer':
          if (data.targetUserId === userId) {
            const peerConnection = createPeerConnection(data.fromUserId);
            connectionsRef.current.set(data.fromUserId, {
              userId: data.fromUserId,
              peerConnection
            });
            
            await peerConnection.setRemoteDescription(data.offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            
            ws.send(JSON.stringify({
              type: 'answer',
              answer,
              targetUserId: data.fromUserId,
              fromUserId: userId
            }));
          }
          break;
          
        case 'answer':
          if (data.targetUserId === userId) {
            const connection = connectionsRef.current.get(data.fromUserId);
            if (connection) {
              await connection.peerConnection.setRemoteDescription(data.answer);
            }
          }
          break;
          
        case 'ice-candidate':
          if (data.targetUserId === userId) {
            const connection = connectionsRef.current.get(data.fromUserId);
            if (connection) {
              await connection.peerConnection.addIceCandidate(data.candidate);
            }
          }
          break;
          
        case 'user-left':
          console.log('User left room:', data.userId);
          const connection = connectionsRef.current.get(data.userId);
          if (connection) {
            connection.peerConnection.close();
            connection.audioElement?.remove();
            connectionsRef.current.delete(data.userId);
            setConnectedUsers(prev => prev.filter(id => id !== data.userId));
            onUserLeft?.(data.userId);
          }
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Voice chat connection error');
    };

    wsRef.current = ws;
  }, [roomId, userId, createPeerConnection, onUserLeft]);

  // Connect to voice chat
  const connect = useCallback(async () => {
    try {
      await initializeLocalMedia();
      initializeWebSocket();
      setIsConnected(true);
      toast.success('Connected to voice chat');
    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      setIsConnected(false);
    }
  }, [initializeLocalMedia, initializeWebSocket]);

  // Disconnect from voice chat
  const disconnect = useCallback(() => {
    // Close all peer connections
    connectionsRef.current.forEach(connection => {
      connection.peerConnection.close();
      connection.audioElement?.remove();
    });
    connectionsRef.current.clear();
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectedUsers([]);
    toast.info('Disconnected from voice chat');
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Apply consciousness-aware audio filters
  const applyConsciousnessFilter = useCallback((state: string) => {
    if (!localStreamRef.current) return;
    
    // This would implement real-time audio processing based on consciousness state
    // For now, we'll adjust the gain and apply basic filters
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(localStreamRef.current);
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    switch (state) {
      case 'meditative':
        gainNode.gain.value = 0.7;
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        break;
      case 'expanded':
        gainNode.gain.value = 1.2;
        filter.type = 'highpass';
        filter.frequency.value = 200;
        break;
      case 'focused':
        gainNode.gain.value = 1.0;
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        break;
      default:
        gainNode.gain.value = 1.0;
        filter.type = 'allpass';
    }
    
    source.connect(filter);
    filter.connect(gainNode);
    
    toast.info(`Applied ${state} consciousness filter to voice`);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isMuted,
    connectedUsers,
    localStream,
    connect,
    disconnect,
    toggleMute,
    applyConsciousnessFilter
  };
};