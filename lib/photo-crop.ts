export type PhotoCrop = { zoom: number; x: number; y: number };
export const DEFAULT_CROP: PhotoCrop = { zoom: 1, x: 50, y: 24 };

export function cropRectangle(width: number, height: number, crop: PhotoCrop) {
  if (![width, height, crop.zoom, crop.x, crop.y].every(Number.isFinite) || width <= 0 || height <= 0) {
    throw new Error('Invalid image dimensions or crop.');
  }
  const zoom = Math.max(1, Math.min(4, crop.zoom));
  const w = Math.min(width, height * 4 / 5) / zoom;
  const h = w * 5 / 4;
  return {
    x: (width - w) * Math.max(0, Math.min(100, crop.x)) / 100,
    y: (height - h) * Math.max(0, Math.min(100, crop.y)) / 100,
    width: w, height: h,
  };
}
