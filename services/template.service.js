import Template from '../models/template.model.js';
import { deleteFilesIfExists } from '../funcitions/index.js';
import { fetchUserByIdService, updateUserByIdService } from './user.service.js';

const fetchTemplateByIdService = async (templateId) => {
  const template = await Template.findById(templateId);
  return template;
};
const fetchAllTemplatesService = async () => {
  const templates = await Template.find({});
  return templates;
};

const createTemplateService = async (data) => {
  const template = await Template.create(data);
  return template;
};

const updateTemplateByIdService = async ({ templateId, data }) => {
  const { newImage } = data;
  if (newImage) {
    data.templateImage = newImage;
  }
  const template = await Template.findByIdAndUpdate({ _id: templateId }, { ...data }, { runValidators: true, new: false });
  if (newImage) {
    // Delete previous image
    await deleteFilesIfExists([template.templateImage]);
  }
  return template;
};

const starTemplateByIdService = async ({ userId, templateId }) => {
  const user = await fetchUserByIdService(userId);
  if (!user.starredTemplates.includes(templateId)) {
    const updatedUserData = { $push: { starredTemplates: templateId.toString() } };
    await updateUserByIdService({ userId, data: updatedUserData });
    const updatedTemplateData = { $inc: { stars: 1 } };
    await updateTemplateByIdService({ templateId, data: updatedTemplateData });
    return true;
  }
  return false;
};

const unStarTemplateByIdService = async ({ userId, templateId }) => {
  const user = await fetchUserByIdService(userId);
  if (user.starredTemplates.includes(templateId)) {
    const updatedUserData = { $pull: { starredTemplates: templateId } };
    await updateUserByIdService({ userId, data: updatedUserData });
    const updatedTemplateData = { $inc: { stars: -1 } };
    await updateTemplateByIdService({ templateId, data: updatedTemplateData });
    return true;
  }
  return false;
};

export {
  createTemplateService,
  fetchTemplateByIdService,
  fetchAllTemplatesService,
  starTemplateByIdService,
  unStarTemplateByIdService,
  updateTemplateByIdService,
};
