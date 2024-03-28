import {
  createTemplateService,
  fetchTemplateByIdService,
  fetchAllTemplatesService,
  starTemplateByIdService,
  unStarTemplateByIdService,
  updateTemplateByIdService,
} from '../services/template.service.js';
import { BadRequestError } from '../errors/index.js';
import { uploadImageToS3 } from '../AWS/uploadToS3.AWS.js';
const createTemplate = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  if (!req.file) {
    throw new BadRequestError('Please provide template image.');
  }
  // get S3 Url of the image
  const templateImage = await uploadImageToS3({ file: req.file, userId });
  const data = { templateImage, ...req.body };
  const template = await createTemplateService(data);
  return res.status(200).send({ template });
};

const getTemplate = async (req, res) => {
  const { templateId } = req.params;
  const template = await fetchTemplateByIdService(templateId);
  return res.status(200).send({ template });
};

const getAllTemplates = async (req, res) => {
  const templates = await fetchAllTemplatesService();
  return res.status(200).send({ templates });
};

const updateTemplate = async (req, res) => {
  const { templateId } = req.params;
  let data = { ...req.body };
  if (req.file) {
    const projectImage = await uploadImageToS3({ file: req.file, userId });
    data.newImage = projectImage;
  }
  const template = await updateTemplateByIdService({ templateId, data });
  return res.status(200).send({ template });
};

const starTemplate = async (req, res) => {
  const { userId } = req.body;
  const { templateId } = req.params;
  const templateStarred = await starTemplateByIdService({ userId, templateId });
  return res.status(200).send({ success: templateStarred });
};

const unStarTemplate = async (req, res) => {
  const { userId } = req.body;
  const { templateId } = req.params;
  const templateUnStarred = await unStarTemplateByIdService({ userId, templateId });
  return res.status(200).send({ success: templateUnStarred });
};

export { getTemplate, getAllTemplates, createTemplate, starTemplate, unStarTemplate, updateTemplate };
