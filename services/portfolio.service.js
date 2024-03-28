import { fetchUserByIdService, updateUserByIdService } from './user.service.js';
import Portfolio from '../models/portfolio.model.js';

const createPortfolioService = async ({ userId, data }) => {
  // No cover image for now
  const portfolio = await Portfolio.create({ createdBy: userId, ...data });
  // Update user data
  const updatedUserData = { portfolioCreated: true };
  await updateUserByIdService({ userId, data: updatedUserData });
  return portfolio;
};

// Fetch portfolio by params
const fetchPortfolioService = async (params) => {
  const Portfolios = await Portfolio.findOne(params);
  return Portfolios;
};

// Fetch portfolio by ID
const fetchPortfolioByUserIdService = async (userId) => {
  const Portfolios = await Portfolio.findOne({ createdBy: userId });
  return Portfolios;
};

// Update portfolio by user id
const updatePortfolioByUserIdService = async ({ userId, data }) => {
  const updatedPortfolio = await Portfolio.findOneAndUpdate({ createdBy: userId }, { ...data }, { runValidators: true, new: true });
  return updatedPortfolio;
};

// Delete portfolio
const deletePortfolioByUserIdService = async (userId) => {
  const deletedPortfolio = await Portfolio.findByIdAndDelete({ createdBy: userId });
  return deletedPortfolio ? true : false;
};

// Like portfolio
const likePortfolioByUserIdService = async ({ userId, likedUserId }) => {
  const user = await fetchUserByIdService(userId);
  // Get user details
  const { username } = user;

  // If the Portfolio is unliked
  if (!user.likedPortfolios.includes(likedUserId)) {
    // Update user likedPortfolios
    const updatedUserData = { $push: { likedPortfolios: likedUserId } };
    await updateUserByIdService({ userId, data: updatedUserData });

    // Update Portfolio PortfolioLikes and PortfolioLikedBy
    const updatedPortfolioData = {
      $inc: { PortfolioLikes: 1 },
      $push: { PortfolioLikedBy: { username, userId } },
    };
    await updatePortfolioByUserIdService({ userId: likedUserId, data: updatedPortfolioData });

    return true;
  }
  return false;
};

// Unlike
const unlikePortfolioByUserIdService = async ({ userId, likedUserId }) => {
  const user = await fetchUserByIdService(userId);

  // If the Portfolio is liked
  if (user.likedPortfolios.includes(likedUserId)) {
    // Update user likedPortfolios
    const updatedUserData = { $pull: { likedPortfolios: likedUserId } };
    await updateUserByIdService({ userId, data: updatedUserData });

    // Update Portfolio PortfolioLikes and PortfolioLikedBy
    const updatedPortfolioData = { $inc: { PortfolioLikes: -1 }, $pull: { PortfolioLikedBy: userId } };
    await updatePortfolioByUserIdService({ userId: likedUserId, data: updatedPortfolioData });

    return true;
  }
  return false;
};

export {
  createPortfolioService,
  fetchPortfolioService,
  fetchPortfolioByUserIdService,
  updatePortfolioByUserIdService,
  deletePortfolioByUserIdService,
  likePortfolioByUserIdService,
  unlikePortfolioByUserIdService,
};
