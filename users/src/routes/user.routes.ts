import express from 'express';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
} from '../utils/validation.js';
import { validate } from '../middleware/validate.js';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', validate(createUserSchema), (req, res) =>
  userController.createUser(req, res)
);
router.get('/', (req, res) => userController.getUsers(req, res));
router.get('/:id', validate(getUserSchema), (req, res) =>
  userController.getUser(req, res)
);
router.patch('/:id', validate(updateUserSchema), (req, res) =>
  userController.updateUser(req, res)
);
router.delete('/:id', validate(getUserSchema), (req, res) =>
  userController.deleteUser(req, res)
);

export default router;
