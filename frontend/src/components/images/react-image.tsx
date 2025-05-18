import { Img } from 'react-image';

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
  unloaderSrc = 'https://i.pinimg.com/736x/96/69/72/966972471970ab014cdb7cb1529118dd.jpg',
}: ReactImageProps) => {
  return (
    <Img
      className={className}
      src={src}
      alt={alt}
      loader={<div className="bg-primary h-full w-full animate-pulse"></div>}
      unloader={<img src={unloaderSrc} alt={alt} />}
    />
  );
};

export default ReactImage;
