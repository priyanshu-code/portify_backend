import { fetchUserByIdService, updateUserByIdService } from './user.service.js';
import Project from '../models/project.model.js';
import { deleteFilesIfExists } from '../funcitions/index.js';
import { uploadImageToS3 } from '../AWS/uploadToS3.AWS.js';
import { deleteObjectFromS3 } from '../AWS/deleteFromS3.AWS.js';
const fetchAllPorjectsService = async (userId) => {
  const projects = await Project.find({ createdBy: userId });
  // Sort projects according to showcase
  projects.sort((a, b) => {
    if (a.showcase && !b.showcase) {
      return -1; // a comes before b
    } else if (!a.showcase && b.showcase) {
      return 1; // b comes before a
    } else {
      return 0; // Maintain the original order
    }
  });
  return projects ? projects : false;
};

const fetchProjectByIdService = async (projectId) => {
  const project = await Project.findById({ _id: projectId });
  return project;
};

// Fetch projects for explore page
const fetchProjectsService = async (params) => {
  const projects = await Project.find(params);
  return projects;
};

const createProjectService = async ({ userId, data }) => {
  const user = await fetchUserByIdService(userId);
  const { showcase, projectImage } = data;
  const projectImageUrl = await uploadImageToS3({ userId, file: projectImage });
  const project = await Project.create({
    ...data,
    // Adding user attributes
    projectImage: projectImageUrl,
    creator: user.username,
    creatorAvatar: user.picturePath,
  });
  if (showcase === 'true') {
    //Update showcase in user
    const data = { $inc: { showcaseProjects: 1 } };
    await updateUserByIdService({ userId, data });
  }
  return project;
};

const updateProjectByIdService = async ({ userId, projectId, data }) => {
  const { newImage, showcase } = data;
  // Only if there is showcase in data user will update
  if (showcase !== undefined) {
    const project = await fetchProjectByIdService(projectId);
    if (project.showcase.toString() !== showcase) {
      let data = {};
      if (showcase === 'true') {
        data = { $inc: { showcaseProjects: 1 } };
      } else {
        data = { $inc: { showcaseProjects: -1 } };
      }
      await updateUserByIdService({ userId, data });
    }
  }
  // Project update
  if (newImage) {
    // Upload to S3
    const projectImage = await uploadImageToS3({ userId, file: newImage });
    data.projectImage = projectImage;
    // Update project but get old details to delete image.
    const project = await Project.findOneAndUpdate({ _id: projectId }, { ...data }, { runValidators: true, new: false });
    // get objectUrl
    const objectUrl = project.projectImage;
    // Delete previous image from S3
    await deleteObjectFromS3({ userId, objectUrl });
    // Fetch updated project again
    const updatedProject = await fetchProjectByIdService(projectId);
    return updatedProject;
  } else {
    const updatedProject = await Project.findOneAndUpdate({ _id: projectId }, { ...data }, { runValidators: true, new: true });
    return updatedProject;
  }
};
const updateManyProjectsByUserIdService = async ({ userId, data }) => {
  const updatedProjects = await Project.updateMany({ createdBy: userId }, data, { runValidators: true, new: true });
  return updatedProjects;
};

const deleteProjectByIdService = async (projectId) => {
  const deletedProject = await Project.findByIdAndDelete({ _id: projectId });
  const { createdBy: userId, showcase, projectImage: objectUrl } = deletedProject;
  if (showcase.toString() === 'true') {
    //Decrement in user
    const data = { $inc: { showcaseProjects: -1 } };
    await updateUserByIdService({ userId, data });
  }
  // Delete image from S3
  await deleteObjectFromS3({ userId, objectUrl });

  return deletedProject ? true : false;
};

// Incomplete
const deleteManyProjectsByUserIdService = async (userId) => {
  const allProjects = await Project.find({ createdBy: userId });
  const user = await fetchUserByIdService(userId);
  const data = { showcaseProjects: 0 };
  await updateUserByIdService({ userId, data });

  //Delete image associated with it
  await deleteFilesIfExists([deletedProject.projectImage]);

  return deletedProject ? true : false;
};

const likeProjectByIdService = async ({ userId, projectId }) => {
  const user = await fetchUserByIdService(userId);
  // Get user details
  const { username } = user;

  // If the project is unliked
  if (!user.likedProjects.includes(projectId)) {
    // Update user likedProjects
    const updatedUserData = { $push: { likedProjects: projectId } };
    await updateUserByIdService({ userId, data: updatedUserData });

    // Update project projectLikes and projectLikedBy
    const updatedProjectData = { $inc: { projectLikes: 1 }, $push: { projectLikedBy: { username, userId } } };
    await updateProjectByIdService({ projectId, data: updatedProjectData });

    return true;
  }
  return false;
};
const unlikeProjectByIdService = async ({ userId, projectId }) => {
  const user = await fetchUserByIdService(userId);

  // If the project is liked
  if (user.likedProjects.includes(projectId)) {
    // Update user likedProjects
    const updatedUserData = { $pull: { likedProjects: projectId } };
    await updateUserByIdService({ userId, data: updatedUserData });

    // Update project projectLikes and projectLikedBy
    const updatedProjectData = { $inc: { projectLikes: -1 }, $pull: { projectLikedBy: userId } };
    await updateProjectByIdService({ projectId, data: updatedProjectData });

    return true;
  }
  return false;
};

export {
  createProjectService,
  fetchAllPorjectsService,
  fetchProjectByIdService,
  fetchProjectsService,
  updateProjectByIdService,
  updateManyProjectsByUserIdService,
  deleteProjectByIdService,
  deleteManyProjectsByUserIdService,
  likeProjectByIdService,
  unlikeProjectByIdService,
};
