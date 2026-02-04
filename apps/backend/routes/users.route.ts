import express, { type Router } from 'express';
import { getUsers, createUser } from '../services/user.service';
import type { CreateUserDTO, UserDTO, ValidationErrorDTO } from '@receipt-reader/shared-types';

const router: Router = express.Router();

// GET /api/users - Get all users, optionally filtered by search query
router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    const search = req.query.search as string | undefined;

    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
      return res.json(filtered);
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve users'
    });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const userData: CreateUserDTO = req.body;

    const result = await createUser(userData);

    if (!('id' in result)) {
      // Validation error
      const errorResponse: ValidationErrorDTO = result;
      return res.status(400).json(errorResponse);
    }

    // Success
    const newUser: UserDTO = result;
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user'
    });
  }
});

export default router;
