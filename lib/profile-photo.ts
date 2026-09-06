import { getSupabaseBrowserClient } from './supabase';

export const PHOTO_BUCKET = 'profile-photos';
export const DEFAULT_PHOTO = '/projects/Headshot.png';
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function profilePhotoUrl(path?: string | null) {
  if (!path || !/^portrait\/[0-9a-f-]{36}\.webp$/.test(path)) return DEFAULT_PHOTO;
  return getSupabaseBrowserClient()?.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl ?? DEFAULT_PHOTO;
}

// Decode and re-encode uploads: reject unsupported files, resize, and strip metadata.
export async function prepareProfilePhoto(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.');
  }
  if (!file.size || file.size > MAX_PHOTO_BYTES) throw new Error('Choose an image smaller than 5 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40000000) throw new Error('This image is too large. Export a smaller version.');
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare the image.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => {
      if (blob && blob.type === 'image/webp' && blob.size <= MAX_PHOTO_BYTES) resolve(blob);
      else reject(new Error('Could not prepare this image. Try another photo.'));
    }, 'image/webp', 0.85));
  } finally {
    bitmap.close();
  }
}
