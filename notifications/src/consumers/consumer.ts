import {
  RabbitMQConfig,
  RabbitMQConsumer,
  UserCreatedEvent,
  UserDeletedEvent,
  UserEvent,
} from 'mg-shared';
import config from '../config/config.js';

const rabbitConfig: RabbitMQConfig = {
  url: config.rabbitmq.uri || 'amqp://admin:admin@rabbitmq:5672',
  queue: config.rabbitmq.queues.userEventsNotifications,
  exchange: config.rabbitmq.exchanges.userEvents,
  exchangeType: 'topic',
  routingKey: 'user.*',
  prefetchCount: 10,
  queueOptions: {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': config.rabbitmq.deadLetterExchange,
    },
  },
};

export class NotificationConsumer {
  private consumer: RabbitMQConsumer;
  private consumerTag?: string;

  constructor() {
    this.consumer = new RabbitMQConsumer(rabbitConfig);
  }

  async start() {
    this.consumerTag = await this.consumer.consume(
      this.handleEvent.bind(this),
      { consumerTag: 'notifications-service' }
    );
    console.log('Notification consumer started with tag:', this.consumerTag);
  }

  private async handleEvent(event: UserEvent) {
    try {
      switch (event.type) {
        case 'USER_CREATED':
          await this.handleUserCreated(event);
          break;
        case 'USER_DELETED':
          await this.handleUserDeleted(event);
          break;
        default:
          console.warn('Unknown event type');
      }
    } catch (error) {
      console.error('Error handling event:', error);
      throw error;
    }
  }

  private async handleUserCreated(event: UserCreatedEvent) {
    console.log(`Welcome ${event.data.name}! (${event.data.email})`);
  }

  private async handleUserDeleted(event: UserDeletedEvent) {
    console.log(`User with ID: ${event.data.userId} was deleted`);
  }

  async stop() {
    if (this.consumerTag) {
      await this.consumer.cancel(this.consumerTag);
    }
    await this.consumer.close();
  }
}
