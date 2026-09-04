import ImageKit from 'imagekit';

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_AzVFBiMBL7qidkoKpbvbErgv8Hg=';
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_n9XDywOfCJkiTaw6Im65vGKsbH4=';
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/2nle9znkn';

// Initialize ImageKit server instance
export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

// Helper for client-side authentication signature
export function getImageKitAuth() {
  return imagekit.getAuthenticationParameters();
}

// Helper to upload a buffer/base64 file from server
export async function uploadImage(
  file: string | Buffer,
  fileName: string,
  folder: string = '/articles'
) {
  try {
    const result = await imagekit.upload({
      file, // can be base64 string, binary buffer, or remote URL
      fileName,
      folder,
      useUniqueFileName: true,
    });
    return {
      success: true,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      fileId: result.fileId,
      name: result.name,
    };
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    return {
      success: false,
      error: error.message || 'ImageKit upload failed',
    };
  }
}
