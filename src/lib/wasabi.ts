import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.WASABI_REGION || "us-west-1",
  endpoint: process.env.WASABI_ENDPOINT || "https://s3.us-west-1.wasabisys.com",
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export async function createSignedUploadUrl(
  venueId: string,
  folder: "cover" | "gallery",
  filename: string,
  contentType: string
) {
  const key = `venues/${venueId}/${folder}/${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.WASABI_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
  const publicUrl = `${process.env.WASABI_PUBLIC_BASE_URL}/${key}`;

  return { signedUrl, publicUrl, key };
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
