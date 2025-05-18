import fallbackImage from '@/assets/images/no-image-available.jpg';

export const getImageUrl = (
  baseUrl: string,
  image?: string,
  fallback: string = fallbackImage,
): string => {
  if (!image) return fallback || '';

  return `${baseUrl}/${image}`;
};
