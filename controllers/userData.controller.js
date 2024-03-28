import { NotFoundError } from '../errors/index.js';
import { fetchUserDataByUserIdService, updateUserDataByUserIdService, deleteUserDataByUserIdService } from '../services/userData.service.js';

const getUserData = async (req, res) => {
  const { userId } = req.body;
  const userData = await fetchUserDataByUserIdService(userId);
  if (!userData) {
    throw new NotFoundError('No userData found');
  }
  return res.status(200).send({ userData });
};

const deleteUserData = async (req, res) => {
  const { userId } = req.body;
  const deleteUserData = await deleteUserDataByUserIdService(userId);
  return res.status(200).send({ success: deleteUserData });
};

const updateUserData = async (req, res) => {
  const { userId } = req.body;
  const userData = await updateUserDataByUserIdService({ userId, data: req.body });
  return res.status(200).send({ userData });
};


export { getUserData, deleteUserData, updateUserData };
