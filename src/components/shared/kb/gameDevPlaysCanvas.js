/** Canvas-хелперы для демо раздела "Разработка игр". */

export function drawTexturePreview(ctx, w, h, activeMapIds) {
  const bg =
    getComputedStyle(document.documentElement).getPropertyValue('--ifm-background-color').trim() ||
    '#fff';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const pad = 24;
  const uw = w - pad * 2;
  const uh = (h - pad * 2) * 0.55;
  const ux = pad;
  const uy = pad;

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(ux, uy, uw, uh);
  ctx.setLineDash([]);

  ctx.font = '11px Segoe UI, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('UV-острова (развёртка)', ux + 4, uy - 6);

  const islands = [
    {x: 0.05, y: 0.1, w: 0.42, h: 0.75},
    {x: 0.52, y: 0.08, w: 0.2, h: 0.35},
    {x: 0.52, y: 0.5, w: 0.38, h: 0.4},
  ];
  islands.forEach((is, i) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(ux + is.x * uw, uy + is.y * uh, is.w * uw, is.h * uh);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(ux + is.x * uw, uy + is.y * uh, is.w * uw, is.h * uh);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(String(i + 1), ux + is.x * uw + 4, uy + is.y * uh + 14);
  });

  const previewY = uy + uh + 28;
  const pw = uw;
  const ph = h - previewY - pad;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(ux, previewY, pw, ph);

  if (activeMapIds.includes('albedo')) {
    const g = ctx.createLinearGradient(ux, previewY, ux + pw, previewY + ph);
    g.addColorStop(0, '#92400e');
    g.addColorStop(0.5, '#b45309');
    g.addColorStop(1, '#78350f');
    ctx.fillStyle = g;
    ctx.fillRect(ux, previewY, pw, ph);
  }

  if (activeMapIds.includes('normal')) {
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 40; i += 1) {
      ctx.strokeStyle = i % 2 ? '#818cf8' : '#4f46e5';
      ctx.beginPath();
      ctx.moveTo(ux + (i % 8) * (pw / 8), previewY);
      ctx.lineTo(ux + ((i % 8) + 0.5) * (pw / 8), previewY + ph);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (activeMapIds.includes('rough')) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#e2e8f0';
    for (let x = ux; x < ux + pw; x += 6) {
      for (let y = previewY; y < previewY + ph; y += 6) {
        if ((x + y) % 12 === 0) ctx.fillRect(x, y, 3, 3);
      }
    }
    ctx.globalAlpha = 1;
  }

  if (activeMapIds.includes('metal')) {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(ux + pw * 0.55, previewY, pw * 0.4, ph * 0.35);
    ctx.globalAlpha = 1;
  }

  if (activeMapIds.includes('ao')) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#000';
    ctx.fillRect(ux, previewY + ph * 0.7, pw * 0.35, ph * 0.28);
    ctx.fillRect(ux + pw * 0.6, previewY, pw * 0.25, ph * 0.4);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = '#f8fafc';
  ctx.font = '12px Segoe UI, sans-serif';
  ctx.fillText('Превью на меше', ux, previewY - 6);
}
