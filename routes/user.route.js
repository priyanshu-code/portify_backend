import express from 'express';
const router = express.Router();
import { getUser, deleteUser, updateUser, resetUserPassword } from '../controllers/user.controller.js';

router.route('/').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/resetPassword').post(resetUserPassword);
export default router;
