import express from 'express';
const router = express.Router();
import { getTemplate, getAllTemplates, createTemplate, starTemplate, unStarTemplate, updateTemplate } from '../controllers/template.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
router.route('/').post(createTemplate).get(getAllTemplates);
router.route('/:templateId').get(getTemplate).patch(updateTemplate);
router.route('/star/:templateId').patch(authMiddleware, starTemplate);
router.route('/unstar/:templateId').patch(authMiddleware, unStarTemplate);

export default router;
