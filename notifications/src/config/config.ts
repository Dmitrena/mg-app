import dotenv from 'dotenv';

dotenv.config();

export default {
  rabbitmq: {
    uri: process.env.RABBITMQ_URL,
    exchanges: {
      userEvents: 'user_events_exchange',
    },
    queues: {
      userEventsNotifications: 'user_events_notifications',
    },
    deadLetterExchange: 'user_events_dlx',
  },
};
