import { useEffect, useState } from 'react';
import { Img } from 'react-image';
import fallbackImage from '@/assets/images/no-image-available.jpg';

type ReactImageProps = {
  className?: string;
  src: string;
  alt?: string;
  unloaderSrc?: string;
};

const ReactImage = ({
  className = '',
  src,
  alt = 'Image not found',
  unloaderSrc = fallbackImage,
}: ReactImageProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Img
      className={className}
      src={src}
      alt={alt}
      loader={<div className="bg-primary h-full w-full animate-pulse" />}
      unloader={<img src={unloaderSrc} alt={alt} />}
    />
  );
};

export default ReactImage;
