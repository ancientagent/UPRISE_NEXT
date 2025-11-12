
import { Job } from 'bullmq';
import fs from 'fs/promises';
import path from 'path';
import { transcodeAudio } from './services/transcode';
import { downloadFromS3, uploadToS3 } from './services/storage';
import { generateWaveform } from './services/waveform';
import { notifyAPI } from './services/webhook';

interface TranscodeJobData {
  trackId: string;
  sourceUrl: string;
  formats: Array<{
    format: string; // 'mp3', 'aac', 'ogg'
    bitrate: string; // '128k', '192k', '320k'
  }>;
  generateWaveform?: boolean;
}

export async function processTranscodeJob(job: Job<TranscodeJobData>) {
  const { trackId, sourceUrl, formats, generateWaveform: shouldGenerateWaveform } = job.data;

  console.log(`Processing transcode job for track ${trackId}`);
  await job.updateProgress(0);

  try {
    // Create temp directory
    const tempDir = path.join('/tmp', `transcode_${trackId}_${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Download source file
    console.log(`Downloading source file: ${sourceUrl}`);
    const sourceFile = path.join(tempDir, 'source');
    await downloadFromS3(sourceUrl, sourceFile);
    await job.updateProgress(20);

    const outputFiles: Array<{ format: string; bitrate: string; url: string }> = [];

    // Transcode to each format
    for (let i = 0; i < formats.length; i++) {
      const { format, bitrate } = formats[i];
      console.log(`Transcoding to ${format} @ ${bitrate}`);

      const outputFile = path.join(tempDir, `output_${bitrate}.${format}`);
      await transcodeAudio(sourceFile, outputFile, format, bitrate);

      // Upload to S3
      const s3Key = `tracks/${trackId}/${bitrate}.${format}`;
      const url = await uploadToS3(outputFile, s3Key);
      outputFiles.push({ format, bitrate, url });

      const progress = 20 + ((i + 1) / formats.length) * 60;
      await job.updateProgress(progress);
    }

    // Generate waveform if requested
    let waveformData: number[] | undefined;
    if (shouldGenerateWaveform) {
      console.log('Generating waveform data');
      waveformData = await generateWaveform(sourceFile);
      await job.updateProgress(90);
    }

    // Notify API of completion
    await notifyAPI(trackId, {
      status: 'ready',
      outputs: outputFiles,
      waveformData,
    });

    await job.updateProgress(100);

    // Cleanup temp files
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      success: true,
      trackId,
      outputs: outputFiles,
      waveformData,
    };
  } catch (error: any) {
    console.error(`Transcode failed for track ${trackId}:`, error);

    // Notify API of failure
    await notifyAPI(trackId, {
      status: 'failed',
      error: error.message,
    });

    throw error;
  }
}
