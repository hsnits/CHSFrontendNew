import React, { useState, useEffect, useRef } from 'react';

const Participant = ({ participant, isLocal }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef();
  const audioRef = useRef();

  // Track subscription handling for remote participants
  useEffect(() => {
    const trackSubscribed = (track) => {
      console.log(`Track subscribed: ${track.kind} for ${participant.identity} (local: ${isLocal})`);
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
      setIsLoading(false);
    };

    const trackUnsubscribed = (track) => {
      console.log(`Track unsubscribed: ${track.kind} for ${participant.identity}`);
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    if (isLocal) {
      // For local participants, get tracks from publications directly
      const localVideoTracks = [];
      const localAudioTracks = [];
      
      participant.tracks.forEach((publication) => {
        if (publication.track) {
          if (publication.track.kind === 'video') {
            localVideoTracks.push(publication.track);
          } else if (publication.track.kind === 'audio') {
            localAudioTracks.push(publication.track);
          }
        }
      });
      
      console.log(`Local participant tracks: ${localVideoTracks.length} video, ${localAudioTracks.length} audio`);
      setVideoTracks(localVideoTracks);
      setAudioTracks(localAudioTracks);
      setIsLoading(false);
      
      // Also listen for track publications for local participant
      const trackPublished = (publication) => {
        console.log(`Local track published: ${publication.track.kind}`);
        if (publication.track.kind === 'video') {
          setVideoTracks(prev => [...prev.filter(t => t !== publication.track), publication.track]);
        } else if (publication.track.kind === 'audio') {
          setAudioTracks(prev => [...prev.filter(t => t !== publication.track), publication.track]);
        }
      };
      
      participant.on('trackPublished', trackPublished);
    } else {
      // For remote participants, handle subscriptions
      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          trackSubscribed(publication.track);
        }
      });

      participant.on('trackSubscribed', trackSubscribed);
      participant.on('trackUnsubscribed', trackUnsubscribed);
    }

    return () => {
      participant.removeAllListeners();
    };
  }, [participant, isLocal]);

  // Attach video track to DOM
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack && videoRef.current) {
      console.log(`Attaching video track for ${participant.identity} (local: ${isLocal})`);
      try {
        const element = videoTrack.attach();
        videoRef.current.innerHTML = '';
        videoRef.current.appendChild(element);
        
        // Ensure video element styling
        const videoElement = element.querySelector ? element : element.getElementsByTagName('video')[0];
        if (videoElement) {
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
          videoElement.style.borderRadius = 'inherit';
        }
      } catch (error) {
        console.error(`Error attaching video track for ${participant.identity}:`, error);
      }
      
      return () => {
        try {
          videoTrack.detach();
        } catch (error) {
          console.error('Error detaching video track:', error);
        }
      };
    }
  }, [videoTracks, participant.identity, isLocal]);

  // Attach audio track to DOM
  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack && audioRef.current) {
      console.log(`Attaching audio track for ${participant.identity} (local: ${isLocal})`);
      try {
        const element = audioTrack.attach();
        audioRef.current.innerHTML = '';
        audioRef.current.appendChild(element);
      } catch (error) {
        console.error(`Error attaching audio track for ${participant.identity}:`, error);
      }
      
      return () => {
        try {
          audioTrack.detach();
        } catch (error) {
          console.error('Error detaching audio track:', error);
        }
      };
    }
  }, [audioTracks, participant.identity, isLocal]);

  // Show loading state
  if (isLoading && !isLocal) {
    return (
      <div className="participant loading">
        <div className="participant-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Connecting...</div>
        </div>
        <audio ref={audioRef} autoPlay={true} muted={isLocal} />
      </div>
    );
  }

  // For audio-only calls or when no video track is available
  if (videoTracks.length === 0) {
    return (
      <div className="participant audio-only">
        <div className="audio-placeholder">
          <div className="audio-avatar">
            <span className="participant-initial">
              {participant.identity ? participant.identity.charAt(0).toUpperCase() : (isLocal ? 'Y' : 'U')}
            </span>
          </div>
          <div className="participant-name">
            {isLocal ? 'You' : (participant.identity || 'Unknown')}
          </div>
        </div>
        <audio ref={audioRef} autoPlay={true} muted={isLocal} />
      </div>
    );
  }

  return (
    <div className={`participant ${isLocal ? 'local' : 'remote'}`}>
      <div className="video-container">
        <div ref={videoRef} className="video-element" />
        <div className="participant-overlay">
          {isLocal && <div className="local-indicator">You</div>}
          <div className="participant-name">
            {isLocal ? 'You' : (participant.identity || 'Unknown')}
          </div>
        </div>
      </div>
      <audio ref={audioRef} autoPlay={true} muted={isLocal} />
    </div>
  );
};

export default Participant;