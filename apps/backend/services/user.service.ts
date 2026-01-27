import fs from 'fs/promises';
import path from 'path';
import type { UserDTO, CreateUserDTO, ValidationErrorDTO } from '@receipt-reader/shared-types';

const USERS_FILE_PATH = path.join(__dirname, '../data/users.json');

// Ensure data directory and file exist
async function ensureUsersFile(): Promise<void> {
  const dir = path.dirname(USERS_FILE_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(USERS_FILE_PATH);
  } catch {
    await fs.writeFile(USERS_FILE_PATH, '[]');
  }
}

async function readUsers(): Promise<UserDTO[]> {
  await ensureUsersFile();
  const content = await fs.readFile(USERS_FILE_PATH, 'utf-8');
  return JSON.parse(content);
}

async function writeUsers(users: UserDTO[]): Promise<void> {
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2));
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  // Basic phone validation: at least 10 digits, can include +, spaces, dashes, parentheses
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export async function getUsers(): Promise<UserDTO[]> {
  return readUsers();
}

export async function createUser(userData: CreateUserDTO): Promise<UserDTO | ValidationErrorDTO> {
  const errors: Record<string, string> = {};

  // Validate name
  if (!userData.name || typeof userData.name !== 'string') {
    errors.name = 'Name is required and must be a string';
  } else if (userData.name.trim().length === 0) {
    errors.name = 'Name cannot be empty';
  } else if (userData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  // Validate phone
  if (!userData.phone || typeof userData.phone !== 'string') {
    errors.phone = 'Phone is required and must be a string';
  } else if (userData.phone.trim().length === 0) {
    errors.phone = 'Phone cannot be empty';
  } else if (!validatePhone(userData.phone.trim())) {
    errors.phone = 'Invalid phone number format';
  }

  // Validate email
  if (!userData.email || typeof userData.email !== 'string') {
    errors.email = 'Email is required and must be a string';
  } else if (userData.email.trim().length === 0) {
    errors.email = 'Email cannot be empty';
  } else if (!validateEmail(userData.email.trim())) {
    errors.email = 'Invalid email format';
  }

  // Validate age
  if (userData.age === undefined || userData.age === null) {
    errors.age = 'Age is required';
  } else if (typeof userData.age !== 'number') {
    errors.age = 'Age must be a number';
  } else if (userData.age <= 0) {
    errors.age = 'Age must be a positive number';
  } else if (!Number.isInteger(userData.age)) {
    errors.age = 'Age must be a whole number';
  } else if (userData.age > 150) {
    errors.age = 'Age must be a reasonable value';
  }

  if (Object.keys(errors).length > 0) {
    const error: ValidationErrorDTO = {
      error: 'Validation Error',
      message: 'Invalid user data',
      fields: errors
    };
    return error;
  }

  const users = await readUsers();

  // Check for duplicate email
  const emailExists = users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
  if (emailExists) {
    const error: ValidationErrorDTO = {
      error: 'Validation Error',
      message: 'Email already exists',
      fields: { email: 'A user with this email already exists' }
    };
    return error;
  }

  const newUser: UserDTO = {
    id: crypto.randomUUID(),
    name: userData.name.trim(),
    phone: userData.phone.trim(),
    email: userData.email.trim(),
    age: userData.age
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
}
