import { Request, Response } from 'express';
import { PaginationOptions } from '../utils/pagination.js';
import { loggerFactory } from 'mg-shared';
import { userService } from '../services/user.service.js';
import { v4 as uuidv4 } from 'uuid';
import { UNKNOWN_ERROR } from '../common/errors.js';

export class UserController {
  private readonly logger;

  constructor() {
    this.logger = loggerFactory(import.meta.url).child({
      service: 'UserController',
    });
  }

  async createUser(req: Request, res: Response) {
    const lg = this.logger.child({ method: 'createUser' });
    lg.debug('Creating user', { body: req.body });

    const correlationId = uuidv4();

    try {
      const user = await userService.createUser(req.body, correlationId);
      res.status(201).json(user);
    } catch (error) {
      let errorMessage = UNKNOWN_ERROR;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      lg.error('Failed to create user', {
        error: errorMessage,
        correlationId,
      });
      res.status(409).json({ message: errorMessage, correlationId });
    }
  }

  async getUsers(req: Request, res: Response) {
    const lg = this.logger.child({ method: 'getUsers' });
    lg.debug('Fetching users', { query: req.query });

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const options: PaginationOptions = { page, limit };

      const result = await userService.getUsers(options);
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = UNKNOWN_ERROR;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      lg.error('Failed to fetch users', { error: errorMessage });
      res.status(500).json({ message: errorMessage });
    }
  }

  async getUser(req: Request, res: Response) {
    const lg = this.logger.child({
      method: 'getUser',
      userId: req.params.id,
    });
    lg.debug('Fetching user');

    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        lg.warn('User not found');
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      let errorMessage = UNKNOWN_ERROR;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      lg.error('Failed to fetch user', { error: errorMessage });
      res.status(500).json({ message: errorMessage });
    }
  }

  async updateUser(req: Request, res: Response) {
    const lg = this.logger.child({
      method: 'updateUser',
      userId: req.params.id,
    });
    lg.debug('Updating user', { updates: req.body });

    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        lg.warn('User not found for update');
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      let errorMessage = UNKNOWN_ERROR;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      lg.error('Failed to update user', { error: errorMessage });
      res.status(500).json({ message: errorMessage });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const lg = this.logger.child({
      method: 'deleteUser',
      userId: req.params.id,
    });
    lg.debug('Deleting user');

    const correlationId = uuidv4();

    try {
      const user = await userService.deleteUser(req.params.id, correlationId);
      if (!user) {
        lg.warn('User not found for deletion');
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      let errorMessage = UNKNOWN_ERROR;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      lg.error('Failed to delete user', {
        error: errorMessage,
        correlationId,
      });
      res.status(500).json({ message: errorMessage, correlationId });
    }
  }
}

export const userController = new UserController();
