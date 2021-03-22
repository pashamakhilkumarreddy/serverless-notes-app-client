import { Storage } from 'aws-amplify';

export async function uploadToS3(file) {
  try {
    if (file) {
      const filename = `${Date.now()}-${file.name}`;
      const stored = await Storage.vault.put(filename, file, {
        contentType: file.type,
      });
      return stored.key;
    }
  } catch (err) {
    console.error(err);
  }
}