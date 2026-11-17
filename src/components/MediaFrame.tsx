import React, { useState } from 'react';

interface MediaFrameProps {
  type?: 'image' | 'video';
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  type = 'image',
  src,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  poster,
  autoPlay = true,
  controls = false,
  muted = true,
  loop = true,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#F3ECE2] via-[#E6DACB] to-[#D7C4B4] flex flex-col items-center justify-center p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8B1E3F"
          strokeWidth="1.25"
          className="mb-3 opacity-80"
          aria-hidden="true"
        >
          <path d="M12 2c1.2 1.8 2 3.2 2 4.5a2 2 0 1 1-4 0c0-1.3.8-2.7 2-4.5Z" />
          <rect x="8" y="10" width="8" height="11" rx="1" />
          <path d="M12 8.5V10" />
        </svg>
        <span className="font-serif text-sm text-[#1C110E] tracking-wide">{alt}</span>
      </div>
    );
  }

  if (type === 'video' || src.endsWith('.mp4')) {
    const videoSrc =
      !autoPlay && !src.includes('#') ? `${src}#t=0.1` : src;
    return (
      <video
        src={videoSrc}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        aria-label={alt}
        onError={() => setHasError(true)}
        className={`${imgClassName} ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${imgClassName} ${className}`}
    />
  );
};
