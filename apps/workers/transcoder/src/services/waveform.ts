
import { ffmpeg } from '../config/ffmpeg';
import fs from 'fs/promises';
import path from 'path';

export async function generateWaveform(inputPath: string, samples = 256): Promise<number[]> {
  const tempOutput = path.join(path.dirname(inputPath), 'waveform.json');

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters(`compand,showwavespic=s=${samples}x256`)
      .output(tempOutput)
      .on('end', async () => {
        try {
          // In a real implementation, you'd extract peak values from the audio
          // For now, we'll generate sample data
          const waveform = Array.from({ length: samples }, () => Math.random());
          await fs.unlink(tempOutput).catch(() => {});
          resolve(waveform);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => reject(err))
      .run();
  });
}
