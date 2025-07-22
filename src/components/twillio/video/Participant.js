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

    if (isLocal) {
      // For local participant, get tracks directly from publications
      participant.tracks.forEach((publication) => {
        if (publication.track) {
          console.log(`Local track found: ${publication.track.kind} for ${participant.identity}`);
          if (publication.track.kind === 'video') {
            setVideoTracks((prev) => prev.includes(publication.track) ? prev : [...prev, publication.track]);
          } else if (publication.track.kind === 'audio') {
            setAudioTracks((prev) => prev.includes(publication.track) ? prev : [...prev, publication.track]);
          }
        }
      });

      // Listen for new tracks being published by local participant
      const trackPublished = (publication) => {
        console.log(`Local track published: ${publication.track.kind}`);
        if (publication.track.kind === 'video') {
          setVideoTracks((prev) => prev.includes(publication.track) ? prev : [...prev, publication.track]);
        } else if (publication.track.kind === 'audio') {
          setAudioTracks((prev) => prev.includes(publication.track) ? prev : [...prev, publication.track]);
        }
      };

      participant.on('trackPublished', trackPublished);

      return () => {
        participant.off('trackPublished', trackPublished);
      };
    } else {
      // For remote participant, handle subscriptions
      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          trackSubscribed(publication.track);
        }
      });

      participant.on('trackSubscribed', trackSubscribed);
      participant.on('trackUnsubscribed', trackUnsubscribed);

      return () => {
        participant.off('trackSubscribed', trackSubscribed);
        participant.off('trackUnsubscribed', trackUnsubscribed);
      };
    }
  }, [participant, isLocal]);

  // Attach video track to DOM
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack && videoRef.current) {
      console.log(`🎥 Attaching video track for ${participant.identity} (local: ${isLocal})`);
      console.log(`🔧 Video track details:`, {
        kind: videoTrack.kind,
        enabled: videoTrack.enabled,
        id: videoTrack.id,
        isLocal: isLocal
      });
      
      try {
        const element = videoTrack.attach();
        videoRef.current.innerHTML = '';
        videoRef.current.appendChild(element);
        console.log(`✅ Video element attached successfully for ${isLocal ? 'local' : 'remote'} participant`);
        
        // Add some styling to ensure video is visible
        if (element && element.style) {
          element.style.width = '100%';
          element.style.height = '100%';
          element.style.objectFit = 'cover';
          element.style.borderRadius = isLocal ? '12px' : '0';
        }
      } catch (error) {
        console.error(`❌ Error attaching video track for ${participant.identity}:`, error);
      }
      
      return () => {
        try {
          videoTrack.detach();
          console.log(`🔄 Video track detached for ${participant.identity}`);
        } catch (error) {
          console.error(`❌ Error detaching video track:`, error);
        }
      };
    } else if (isLocal && !videoTrack) {
      console.warn(`⚠️ No video track found for local participant ${participant.identity}`);
      console.log(`📋 Available tracks:`, {
        videoTracksCount: videoTracks.length,
        audioTracksCount: audioTracks.length,
        allPublications: Array.from(participant.tracks.values()).map(pub => ({
          kind: pub.track?.kind,
          enabled: pub.track?.enabled,
          trackSid: pub.trackSid
        }))
      });
    }
  }, [videoTracks, participant.identity, isLocal, audioTracks.length]);

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

  const getDisplayName = () => {
    if (isLocal) {
      return "You";
    }
    
    // Try to extract a readable name from identity
    const identity = participant.identity;
    if (identity && identity.length > 20) {
      // If it's a long ID, show just "Remote User"
      return "Remote User";
    }
    
    return identity || "Remote User";
  };

  return (
    <div className={`participant ${isLocal ? 'local' : 'remote'}`}>
      <div className="video-container">
        <div ref={videoRef} className="video-element" />
        <div className="participant-name">{getDisplayName()}</div>
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