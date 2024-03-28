import express from 'express';
const router = express.Router();

import {
  loginUser,
  registerUser,
  userWithEmailExists,
  requestResetPassword,
  verifyResetToken,
  resetPasswordUsingToken,
} from '../controllers/auth.controller.js';

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/userExist').post(userWithEmailExists);
router.route('/requestResetPassword').post(requestResetPassword);
router.route('/verifyResetToken').post(verifyResetToken);
router.route('/resetPassword').post(resetPasswordUsingToken);

export default router;
