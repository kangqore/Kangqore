import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PodcastContext = createContext();

export const PodcastProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setIsPlayerVisible(true); // Automatically show player when playing starts
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (amount) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPlayerVisible(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <PodcastContext.Provider value={{
      isPlaying,
      currentTime,
      duration,
      isPlayerVisible,
      audioRef,
      togglePlay,
      skip,
      seek,
      closePlayer
    }}>
      {children}
      {/* preload="none": this provider is mounted on every page, so
          preload="metadata" made a 23MB request on every route — including
          pages with no visible player, where the element measures 0px. The
          browser ranged it as bytes=0- and pulled the whole file. Nothing
          about playback changes: the src is set, and a user pressing play
          starts the fetch then. */}
      <audio
        ref={audioRef}
        src="/Podcasts/Ep-1.mp3"
        preload="none"
      />
    </PodcastContext.Provider>
  );
};

export const usePodcast = () => {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcast must be used within a PodcastProvider');
  }
  return context;
};
