import { BadRequestError } from '../errors/index.js';
import Portfolio from '../models/portfolio.model.js';
import { fetchAllTemplatesService } from '../services/template.service.js';
import { fetchProjectsService } from '../services/project.service.js';
import User from '../models/user.model.js';
import Project from '../models/project.model.js';
const getFullPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(200).send({ found: false, msg: 'No user' });
    }
    user.password = undefined;
    const userId = user._id;
    const portfolio = await Portfolio.findOne({ createdBy: userId });
    if (!portfolio) {
      return res.status(200).send({ user, found: false, msg: 'No portfolio' });
    }
    const projects = await fetchProjectsService({ createdBy: userId });
    return res.status(200).send({ user, projects, portfolio });
  } catch (error) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const getAllTemplates = async (req, res) => {
  const templates = await fetchAllTemplatesService();
  return res.status(200).send(templates);
};

const getExploreProjects = async (req, res) => {
  const projects = await fetchProjectsService({ showcase: true });
  return res.status(200).send(projects);
};

const exploreSearch = async (req, res) => {
  const { category, q } = req.query;
  if (!q) {
    return res.status(200).send({ found: false, msg: 'Please provide some input.' });
  }
  const searchQuery = q.toString().split(' ');
  let tagsResults = [];
  let creatorResults = [];
  let titleResults = [];
  const queryRegex = searchQuery.map((query) => {
    return new RegExp(query, 'i');
  });
  switch (category) {
    case 'tags':
      tagsResults = await Project.find({
        projectTags: { $in: queryRegex },
        showcase: true,
      });
      break;
    case 'creator':
      creatorResults = await Project.find({
        creator: { $in: queryRegex },
        showcase: true,
      });
      break;
    case 'title':
      titleResults = await Project.find({
        projectName: { $in: queryRegex },
        showcase: true,
      });
      break;
    default:
      tagsResults = await Project.find({
        projectTags: { $in: queryRegex },
        showcase: true,
      });
      creatorResults = await Project.find({
        creator: { $in: queryRegex },
        showcase: true,
      });
      titleResults = await Project.find({
        projectName: { $in: queryRegex },
        showcase: true,
      });
      break;
  }
  let searchResults = [];
  let hashMap = new Map();
  // Filter unique
  [...tagsResults, ...creatorResults, ...titleResults].forEach((item) => {
    if (hashMap.get(item._id.toString()) == null) {
      //Push to result array
      searchResults.push(item);
    }
    hashMap.set(item._id.toString(), true);
  });
  if (searchResults.length < 1) {
    return res.status(200).send({ found: false, length: searchResults.length, searchResults });
  }
  return res.status(200).send({ length: searchResults.length, searchResults });
};

export { getFullPortfolio, getAllTemplates, getExploreProjects, exploreSearch };
