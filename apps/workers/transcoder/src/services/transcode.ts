
import { ffmpeg } from '../config/ffmpeg';

export async function transcodeAudio(
  inputPath: string,
  outputPath: string,
  format: string,
  bitrate: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    // Set audio codec based on format
    switch (format) {
      case 'mp3':
        command = command.audioCodec('libmp3lame');
        break;
      case 'aac':
        command = command.audioCodec('aac');
        break;
      case 'ogg':
        command = command.audioCodec('libvorbis');
        break;
      default:
        command = command.audioCodec('libmp3lame');
    }

    command
      .audioBitrate(bitrate)
      .audioChannels(2)
      .audioFrequency(44100)
      .format(format)
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

export async function getAudioMetadata(inputPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}
