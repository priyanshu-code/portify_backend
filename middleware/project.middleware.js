import { BadRequestError, NotFoundError, CustomAPIError } from '../errors/index.js';
import { fetchUserByIdService } from '../services/user.service.js';
const projectMiddleware = async (req, res, next) => {
  const { userId } = req.body;
  const user = await fetchUserByIdService(userId);
  // If no user found
  if (!user) throw new NotFoundError('No user found.');
  // Check if user has created portfolio or not
  if (!user.portfolioCreated) {
    throw new BadRequestError('Please create your portfolio first.');
  }
  next();
};

export default projectMiddleware;
