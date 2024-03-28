import { NotFoundError } from '../errors/index.js';
import {
  createPortfolioService,
  fetchPortfolioService,
  fetchPortfolioByUserIdService,
  updatePortfolioByUserIdService,
  deletePortfolioByUserIdService,
  likePortfolioByUserIdService,
  unlikePortfolioByUserIdService,
} from '../services/portfolio.service.js';

// Create portfolio
const createPortfolio = async (req, res) => {
  const { userId } = req.body;
  const portfolio = await createPortfolioService({ userId, data: { ...req.body } });
  return res.status(200).send({ portfolio });
};

// Update portfolio
const updatePortfolio = async (req, res) => {
  const { userId } = req.body;
  const portfolio = await updatePortfolioByUserIdService({ userId, data: req.body });
  // If not found
  if (!portfolio) throw new NotFoundError('No portfolio found');
  return res.status(200).send({ portfolio });
};

// Get portfolio
const getPortfolio = async (req, res) => {
  const { userId } = req.body;
  const portfolio = await fetchPortfolioByUserIdService(userId);
  // If not found
  if (!portfolio) throw new NotFoundError('No portfolio found');
  return res.status(200).send({ portfolio });
};

// Like portfolio
const likePortfolio = async (req, res) => {
  const { userId, likedUserId } = req.body;
  const liked = await likePortfolioByUserIdService({ userId, likedUserId });
  return res.status(200).send({ success: liked });
};

// Unlike portfolio
const unlikePortfolio = async (req, res) => {
  const { userId, likedUserId } = req.body;
  const unLiked = await unlikePortfolioByUserIdService({ userId, likedUserId });
  return res.status(200).send({ success: unLiked });
};
export { createPortfolio, updatePortfolio, getPortfolio, likePortfolio, unlikePortfolio };
