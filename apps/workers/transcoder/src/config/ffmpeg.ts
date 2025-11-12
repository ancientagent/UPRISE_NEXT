
import ffmpeg from 'fluent-ffmpeg';

// Configure FFmpeg path if needed
const FFMPEG_PATH = process.env.FFMPEG_PATH;
const FFPROBE_PATH = process.env.FFPROBE_PATH;

if (FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(FFMPEG_PATH);
}

if (FFPROBE_PATH) {
  ffmpeg.setFfprobePath(FFPROBE_PATH);
}

export { ffmpeg };
