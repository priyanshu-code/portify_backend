import { body } from 'express-validator';

export const registerSchema = [
  body('username').isLength({ min: 3, max: 50 }).notEmpty().withMessage('Username is required.'),
  body('firstname').isLength({ min: 1, max: 50 }).notEmpty().withMessage('Firstname is required.'),
  body('lastname').isLength({ min: 1, max: 50 }).notEmpty().withMessage('Lastname is required.'),
  body('email').isLength({ min: 3, max: 50 }).notEmpty().withMessage('Email is required.'),
  body('password').isLength({ min: 6, max: 50 }).notEmpty().withMessage('Password is required.'),
  body('provider').isLength({ min: 4, max: 10 }).notEmpty().withMessage('Provider is required.'),
];
export const login = [
  body('username').isLength({ min: 3, max: 50 }).notEmpty().withMessage('Username is required.'),
  body('password').isLength({ min: 6, max: 50 }).withMessage('Password must be at least 6 characters..'),
  body('provider').isLength({ min: 4, max: 4 }).notEmpty().withMessage('Provider is required.'),
];
