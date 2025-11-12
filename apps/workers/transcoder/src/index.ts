
import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import { processTranscodeJob } from './processor';
import { redisConnection } from './config/redis';

dotenv.config();

const QUEUE_NAME = 'transcode';

const worker = new Worker(QUEUE_NAME, processTranscodeJob, {
  connection: redisConnection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2'),
  limiter: {
    max: 10, // Max 10 jobs
    duration: 60000, // per 60 seconds
  },
});

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log(`🚀 Transcoder worker started (concurrency: ${process.env.WORKER_CONCURRENCY || '2'})`);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing worker');
  await worker.close();
});
