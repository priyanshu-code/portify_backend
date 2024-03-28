import express from 'express';
const router = express.Router();
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  unlikeProject,
} from '../controllers/project.controller.js';

router.route('/:projectId').get(getProject).patch(updateProject).delete(deleteProject);

router.route('/').get(getAllProjects).post(createProject);

router.route('/like/:projectId').patch(likeProject);

router.route('/unlike/:projectId').patch(unlikeProject);

export default router;
