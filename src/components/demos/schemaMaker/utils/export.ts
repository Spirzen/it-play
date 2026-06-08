import type Konva from 'konva';

export async function exportStageImage(
  stage: Konva.Stage,
  format: 'png' | 'jpeg',
  pixelRatio = 2,
): Promise<string> {
  const prevScale = stage.scaleX();
  const prevX = stage.x();
  const prevY = stage.y();

  const layer = stage.getLayers()[0];
  const box = layer.getClientRect({ skipTransform: false });

  const padding = 40;
  const exportW = Math.max(box.width + padding * 2, 100);
  const exportH = Math.max(box.height + padding * 2, 100);

  const dataUrl = stage.toDataURL({
    x: box.x - padding,
    y: box.y - padding,
    width: exportW,
    height: exportH,
    pixelRatio,
    mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
    quality: format === 'jpeg' ? 0.92 : 1,
  });

  stage.scale({ x: prevScale, y: prevScale });
  stage.position({ x: prevX, y: prevY });

  return dataUrl;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function exportStagePdf(stage: Konva.Stage) {
  const { jsPDF } = await import('jspdf');
  const dataUrl = await exportStageImage(stage, 'png', 2);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });

  const padding = 20;
  const w = img.width / 2 + padding * 2;
  const h = img.height / 2 + padding * 2;
  const orientation = w > h ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [w, h],
  });

  pdf.addImage(dataUrl, 'PNG', padding, padding, img.width / 2, img.height / 2);
  pdf.save('schema-maker.pdf');
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
