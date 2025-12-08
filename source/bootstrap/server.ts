import { application } from './application.ts';

try {
  await application.listen({ port: 3000, host: '0.0.0.0' });
  application.log.info(`Server running at http://localhost:3000`);
} catch (err) {
  application.log.error(err);
  process.exit(1);
}

// Graceful shutdown (optional but senior)
process.on('SIGTERM', async () => {
  application.log.info('SIGTERM received — shutting down');
  await application.close();
  process.exit(0);
});