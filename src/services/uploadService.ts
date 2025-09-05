import { CLOUDINARY_FOLDER, CLOUDINARY_NAME, CLOUDINARY_PRESET } from '@env';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export async function uploadToCloudinary(uri: string) {
  let formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('folder', CLOUDINARY_FOLDER);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed: ${res.status} - ${errText}`);
  }

  const data: CloudinaryResponse = await res.json();
  return data.secure_url as string;
}
