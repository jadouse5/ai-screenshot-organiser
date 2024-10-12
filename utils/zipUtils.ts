import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function createZip(files: { name: string; url: string }[]) {
  const zip = new JSZip();

  for (const file of files) {
    const response = await fetch(file.url);
    const blob = await response.blob();
    zip.file(file.name, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);
  saveAs(zipBlob, 'screenshots.zip');
  
  return zipUrl;
}
