import express from 'express';
const router = express.Router();
import { createPortfolio, updatePortfolio, getPortfolio, likePortfolio, unlikePortfolio } from '../controllers/portfolio.controller.js';

router.route('/').post(createPortfolio).get(getPortfolio).patch(updatePortfolio);
router.route('/like').post(likePortfolio);
router.route('/unlike').post(unlikePortfolio);
// router.route("/user")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

export default router;
