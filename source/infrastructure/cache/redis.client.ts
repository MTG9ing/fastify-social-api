import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err: Error) => console.error('Redis Client Error', err));

await client.connect();

export default client;

// Graceful shutdown
process.on('SIGTERM', async () => {
  await client.quit();
});