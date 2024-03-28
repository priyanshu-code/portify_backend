import mongoose from 'mongoose';

// Project Work Schema
const ProjectSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide userId'],
    },
    creator: { type: String },
    creatorAvatar: { type: String },
    projectName: {
      type: String,
      required: [true, 'Please provide project name.'],
      maxlength: 100,
      minlength: 1,
    },
    projectDesc: {
      type: String,
      required: [true, 'Please provide project description.'],
      maxlength: 500,
      minlength: 1,
    },
    projectImage: {
      type: String,
      default: '',
    },
    githubLink: {
      type: String,
      default: '',
      maxlength: 1000,
      match: [/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/, 'Please provide valid url'],
    },
    liveLink: {
      type: String,
      default: '',
      maxlength: 1000,
      match: [/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/, 'Please provide valid url'],
    },
    showcase: {
      type: Boolean,
      default: false,
    },
    projectLikes: {
      type: Number,
      default: 0,
    },
    projectLikedBy: {
      type: [],
      default: [],
    },
    projectTags: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ projectTags: 1 });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
