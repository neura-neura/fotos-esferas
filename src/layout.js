export const PAGE = { width: 215.9, height: 279.4, diameter: 75, gap: .5, count: 9 };
const step = PAGE.diameter + PAGE.gap;
const dx = step * Math.sqrt(3) / 2;
const left = (PAGE.width - (PAGE.diameter + 2 * dx)) / 2;
const top = (PAGE.height - (PAGE.diameter + 2.5 * step)) / 2;
// Read down each column; the middle column is offset by half a step.
export const centers = Array.from({length:9}, (_, i) => {
  const col = Math.floor(i / 3), row = i % 3;
  return { x: left + PAGE.diameter / 2 + col * dx, y: top + PAGE.diameter / 2 + row * step + (col === 1 ? step / 2 : 0) };
});
export function imageRect(image, photo, size) {
  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * photo.zoom / 100;
  const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
  return { x: (size-w)/2 + photo.x*size, y: (size-h)/2 + photo.y*size, w, h };
}
export function drawPhoto(ctx, image, photo, size) {
  ctx.clearRect(0,0,size,size);
  ctx.save(); ctx.beginPath(); ctx.arc(size/2,size/2,size/2,0,Math.PI*2); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,size,size);
  if (image && photo) { const r=imageRect(image,photo,size); ctx.drawImage(image,r.x,r.y,r.w,r.h); }
  ctx.restore();
}
