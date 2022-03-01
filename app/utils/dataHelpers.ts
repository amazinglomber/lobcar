
export function getMediaType(media: string): 'video' | 'image' | 'none' {
  if (media.endsWith('.mp4')) {
    return 'video';
  } else if (media.endsWith('/')) {
    return 'none';
  }

  return 'image';
}
