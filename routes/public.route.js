import express from 'express';
import { exploreSearch, getAllTemplates, getExploreProjects, getFullPortfolio } from '../controllers/public.controller.js';
const router = express.Router();

router.route('/getExploreProjects').get(getExploreProjects);
router.route('/exploreSearch').get(exploreSearch);
router.route('/public/:username').get(getFullPortfolio);
router.route('/publicTemplates').get(getAllTemplates);

//   const create = await AWS.create({ totalImages: 2 });
//   console.log('created');
//   return res.statusCode(200).send(create);
// });

export default router;
