import {
  BlobWriter,
  ZipWriter,
} from '@zip.js/zip.js';

export async function getZipFileBlob(files) {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
  await Promise.all(files.map((file) => zipWriter.add(file.name, file.reader)));
  return zipWriter.close();
}

export async function downloadFile(blob, fileName) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function dummy() {
  const blob = await getZipFileBlob();
  downloadFile(blob);
}
