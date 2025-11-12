
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Client, S3_BUCKET } from '../config/s3';
import fs from 'fs';
import { Readable } from 'stream';

export async function downloadFromS3(s3Url: string, outputPath: string): Promise<void> {
  // Extract key from URL
  const key = s3Url.split(`${S3_BUCKET}/`)[1] || s3Url;

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  const response = await s3Client.send(command);
  const body = response.Body as Readable;

  const writeStream = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    body.pipe(writeStream);
    body.on('error', reject);
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

export async function uploadToS3(filePath: string, key: string): Promise<string> {
  const fileStream = fs.createReadStream(filePath);

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: S3_BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: getContentType(key),
    },
  });

  await upload.done();

  // Return public URL (adjust based on your S3/R2 configuration)
  const baseUrl = process.env.S3_PUBLIC_URL || `https://${S3_BUCKET}.s3.amazonaws.com`;
  return `${baseUrl}/${key}`;
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    mp3: 'audio/mpeg',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
  };
  return types[ext || ''] || 'application/octet-stream';
}
