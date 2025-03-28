import { loggerFactory } from 'mg-shared';
import { NotificationConsumer } from './consumers/consumer.js';

const logger = loggerFactory(import.meta.url);

const consumer = new NotificationConsumer();

async function start() {
  try {
    await consumer.start();
    logger.info({
      step: '🚀 Notification service started',
    });
  } catch (err) {
    logger.error({ step: 'Error starting notification service:', err });
    process.exit(1);
  }
}

start();

process.on('SIGINT', async () => {
  await consumer.stop();
  process.exit(0);
});
