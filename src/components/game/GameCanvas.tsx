export function configureCanvas(canvas: HTMLCanvasElement, wrap: HTMLElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = wrap.getBoundingClientRect();
  canvas.width = Math.max(360, Math.round(bounds.width * dpr));
  canvas.height = Math.max(240, Math.round(bounds.height * dpr));
  canvas.style.width = `${bounds.width}px`;
  canvas.style.height = `${bounds.height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return ctx;
}
