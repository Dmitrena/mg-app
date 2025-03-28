import {
  PublishOptions,
  RabbitMQConfig,
  RabbitMQPublisher,
  UserEvent,
} from 'mg-shared';
import { Types } from 'mongoose';
import config from '../../config/config.js';

const rabbitConfig: RabbitMQConfig = {
  url: config.rabbitmq.uri || 'amqp://admin:admin@rabbitmq:5672',
  exchange: config.rabbitmq.exchanges.userEvents,
  exchangeType: 'topic',
  queueOptions: {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': config.rabbitmq.deadLetterExchange,
    },
  },
};

export class UserEventPublisher {
  private publisher: RabbitMQPublisher;

  constructor() {
    this.publisher = new RabbitMQPublisher(rabbitConfig);
  }

  async publishEvent<T extends UserEvent>(
    event: T,
    options?: PublishOptions
  ): Promise<void> {
    const routingKey = event.type.toLowerCase().replace('_', '.');
    try {
      await this.publisher.publishToExchange(
        {
          ...event,
          metadata: {
            ...event.metadata,
            timestamp: new Date(),
            source: 'users-service',
          },
        },
        routingKey,
        options
      );
    } catch (error) {
      console.error('Failed to publish user event:', error);
      throw error;
    }
  }

  async publishUserCreatedEvent(
    user: { _id: Types.ObjectId; email: string; name: string },
    options?: PublishOptions
  ) {
    const event: UserEvent = {
      type: 'USER_CREATED',
      data: {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
    return this.publishEvent(event, options);
  }

  async publishUserDeletedEvent(userId: string, options?: PublishOptions) {
    const event: UserEvent = {
      type: 'USER_DELETED',
      data: {
        userId: userId,
      },
    };
    return this.publishEvent(event, options);
  }

  async close() {
    await this.publisher.close();
  }
}

export const userEventPublisher = new UserEventPublisher();
