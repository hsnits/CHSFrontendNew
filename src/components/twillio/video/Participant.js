import React, { useState, useEffect, useRef } from 'react';

const Participant = ({ participant, isLocal }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  // Track subscription handling
  useEffect(() => {
    const trackSubscribed = (track) => {
      console.log(`Track subscribed: ${track.kind} for ${participant.identity} (local: ${isLocal})`);
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      console.log(`Track unsubscribed: ${track.kind} for ${participant.identity}`);
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    // Handle tracks that are already published
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        trackSubscribed(publication.track);
      }
    });

    // Handle new track publications
    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      participant.removeAllListeners();
    };
  }, [participant, isLocal]);

  // Attach video track to DOM
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack && videoRef.current) {
      console.log(`Attaching video track for ${participant.identity} (local: ${isLocal})`);
      const element = videoTrack.attach();
      videoRef.current.innerHTML = '';
      videoRef.current.appendChild(element);
      
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks, participant.identity, isLocal]);

  // Attach audio track to DOM
  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack && audioRef.current) {
      console.log(`Attaching audio track for ${participant.identity} (local: ${isLocal})`);
      const element = audioTrack.attach();
      audioRef.current.innerHTML = '';
      audioRef.current.appendChild(element);
      
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks, participant.identity, isLocal]);

  // For audio-only calls, show a placeholder
  if (videoTracks.length === 0 && !isLocal) {
    return (
      <div className="participant audio-only">
        <div className="audio-placeholder">
          <div className="audio-avatar">
            <span className="participant-initial">
              {participant.identity.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="participant-name">{participant.identity}</div>
        </div>
        <audio 
          ref={audioRef} 
          autoPlay={true} 
          muted={isLocal}
        />
      </div>
    );
  }

  return (
    <div className={`participant ${isLocal ? 'local' : 'remote'}`}>
      <div className="video-container">
        <div ref={videoRef} className="video-element" />
        {isLocal && <div className="local-indicator">You</div>}
        <div className="participant-name">{participant.identity}</div>
      </div>
      <audio 
        ref={audioRef} 
        autoPlay={true} 
        muted={isLocal} // Mute local audio to prevent echo
      />
    </div>
  );
};

export default Participant;