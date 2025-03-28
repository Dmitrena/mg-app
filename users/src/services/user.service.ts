import { User } from '../models/user.model.js';
import { IUser, IUserInput } from '../interfaces/user.interface.js';
import { PaginationOptions, paginate } from '../utils/pagination.js';
import { loggerFactory } from 'mg-shared';
import { userEventPublisher } from '../rmq/publishers/user.js';

const logger = loggerFactory(import.meta.url);

export class UserService {
  private readonly logger = logger.child({ service: 'UserService' });

  constructor() {}

  async createUser(
    userData: IUserInput,
    correlationId: string
  ): Promise<IUser> {
    const lg = this.logger.child({ method: 'createUser' });
    try {
      const user = new User(userData);
      await user.save();

      lg.info('User created successfully', { userId: user._id });

      await userEventPublisher.publishUserCreatedEvent(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        {
          correlationId,
          headers: {
            'retry-count': 0,
          },
        }
      );
      return user;
    } catch (error) {
      lg.error('Failed to create user', { error });
      throw error;
    }
  }

  async getUsers(options: PaginationOptions) {
    const lg = this.logger.child({ method: 'getUsers' });
    lg.debug('Fetching users with pagination', { options });
    try {
      const result = await paginate<IUser>(User, {}, options);
      lg.debug('Users fetched successfully', {
        count: result.data.length,
        total: result.pagination.totalItems,
      });
      return result;
    } catch (error) {
      lg.error('Failed to fetch users', { error });
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const lg = this.logger.child({ method: 'getUserById', userId });
    try {
      const user = await User.findById(userId);
      if (!user) {
        lg.warn('User not found');
      } else {
        lg.debug('User found', user._id);
      }
      return user;
    } catch (error) {
      lg.error('Failed to fetch user by ID', { error });
      throw error;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<IUserInput>
  ): Promise<IUser | null> {
    const lg = this.logger.child({ method: 'updateUser', userId });
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      if (!updatedUser) {
        lg.warn('User not found for update');
      } else {
        lg.info('User updated successfully');
      }
      return updatedUser;
    } catch (error) {
      lg.error('Failed to update user', { error });
      throw error;
    }
  }

  async deleteUser(
    userId: string,
    correlationId: string
  ): Promise<IUser | null> {
    const lg = this.logger.child({ method: 'deleteUser', userId });
    lg.debug('Deleting user');

    try {
      const user = await User.findByIdAndDelete(userId);

      if (user) {
        await userEventPublisher.publishUserDeletedEvent(
          user._id.toHexString(),
          {
            correlationId,
            headers: {
              'retry-count': 0,
            },
          }
        );
        lg.info('User deleted and event published');
      } else {
        lg.warn('User not found for deletion');
      }

      return user;
    } catch (error) {
      lg.error('Failed to delete user', { error });
      throw error;
    }
  }
}

export const userService = new UserService();
