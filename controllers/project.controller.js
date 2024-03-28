import { BadRequestError, NotFoundError } from '../errors/index.js';
import {
  fetchAllPorjectsService,
  fetchProjectByIdService,
  createProjectService,
  updateProjectByIdService,
  deleteProjectByIdService,
  likeProjectByIdService,
  unlikeProjectByIdService,
} from '../services/project.service.js';

// Get all projects
const getAllProjects = async (req, res) => {
  const { userId } = req.body;
  const projects = await fetchAllPorjectsService(userId);
  return res.status(200).send({ projects });
};

// Get single project
const getProject = async (req, res) => {
  const { projectId } = req.params;
  const project = await fetchProjectByIdService(projectId);
  if (!project) throw new NotFoundError('Project not found.');
  return res.status(200).send({ project });
};

// Create project
const createProject = async (req, res) => {
  const { userId, showcase } = req.body;
  // If there is no image
  if (!req.file) {
    throw new BadRequestError('Please provide project image.');
  }
  // Set the data
  const data = { createdBy: userId, showcase: showcase || false, projectImage: req.file, ...req.body };
  const project = await createProjectService({ userId, data });
  return res.status(200).send({ project });
};

// Update project
const updateProject = async (req, res) => {
  const { userId, showcase } = req.body;
  const { projectId } = req.params;
  let data = { showcase };
  // If there is a new image
  if (req.file) {
    data.newImage = req.file;
  }
  data = { ...data, ...req.body };
  const project = await updateProjectByIdService({ userId, projectId, data });
  return res.status(200).send({ project });
};

// Delete project
const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const deletedProject = await deleteProjectByIdService(projectId);
  return res.status(200).send({ success: deletedProject });
};

// Like project
const likeProject = async (req, res) => {
  const { userId } = req.body;
  const { projectId } = req.params;
  const liked = await likeProjectByIdService({ userId, projectId: projectId });
  return res.status(200).send({ success: liked });
};

// Unlike project
const unlikeProject = async (req, res) => {
  const { userId } = req.body;
  const { projectId } = req.params;
  const unLiked = await unlikeProjectByIdService({ userId, projectId: projectId });
  return res.status(200).send({ success: unLiked });
};

export { getAllProjects, getProject, createProject, updateProject, deleteProject, likeProject, unlikeProject };
