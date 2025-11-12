
# UPRISE Transcoder Worker

Media transcoding worker using FFmpeg and BullMQ for queue management.

## Features

- **Audio Transcoding**: Convert audio files to multiple formats (MP3, AAC, OGG)
- **Multiple Bitrates**: Generate multiple quality versions (128k, 192k, 320k)
- **Waveform Generation**: Create waveform data for audio visualization
- **S3/R2 Storage**: Upload transcoded files to S3 or Cloudflare R2
- **Queue Management**: BullMQ with Redis for reliable job processing
- **Webhook Notifications**: Notify API when transcoding completes or fails

## Prerequisites

- **FFmpeg**: Must be installed on the system
  ```bash
  # Ubuntu/Debian
  sudo apt-get install ffmpeg
  
  # macOS
  brew install ffmpeg
  ```
- **Redis**: Required for BullMQ queue

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Job Processing

### Job Data Structure

```typescript
{
  trackId: string;
  sourceUrl: string;
  formats: [
    { format: 'mp3', bitrate: '128k' },
    { format: 'mp3', bitrate: '320k' },
    { format: 'aac', bitrate: '192k' }
  ];
  generateWaveform?: boolean;
}
```

### Processing Flow

1. Download source file from S3/R2
2. Transcode to each specified format and bitrate
3. Upload transcoded files to S3/R2
4. Generate waveform data (if requested)
5. Notify API via webhook with results

## Configuration

### FFmpeg Paths

If FFmpeg is not in PATH, set:
- `FFMPEG_PATH` - Path to FFmpeg binary
- `FFPROBE_PATH` - Path to FFprobe binary

### Worker Concurrency

Set `WORKER_CONCURRENCY` to control parallel job processing (default: 2)

### Rate Limiting

Default: 10 jobs per 60 seconds (configured in worker setup)

## Storage

Supports both AWS S3 and Cloudflare R2:

### AWS S3
- Set `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Leave `S3_ENDPOINT` unset

### Cloudflare R2
- Set `S3_ENDPOINT` to R2 endpoint (e.g., `https://accountid.r2.cloudflarestorage.com`)
- Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to R2 credentials
- Set `S3_PUBLIC_URL` to public R2 URL

## Monitoring

- Job completion logs: `✅ Job {id} completed successfully`
- Job failure logs: `❌ Job {id} failed: {error}`
- Worker errors logged to console

## Deployment

Optimized for deployment on AWS Fargate or Fly.io with persistent storage for temp files.
