const Video = ({ className, src, autoPlay, loop, muted }) => {
  return (
    <video
      className={className}
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
    />
  );
};

export default Video;
