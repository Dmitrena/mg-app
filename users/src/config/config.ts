import dotenv from 'dotenv';

dotenv.config();

export default {
  app: {
    port: process.env.PORT || 3000,
  },
  mongodb: {
    uri: process.env.MONGO_URI || '',
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URL,
    exchanges: {
      userEvents: 'user_events_exchange',
    },
    deadLetterExchange: 'user_events_dlx',
  },
};
