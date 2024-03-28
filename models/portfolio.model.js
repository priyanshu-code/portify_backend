import mongoose from 'mongoose';

// Work Experience Schema
const WorkHistorySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please provide Company Name'],
    maxlength: 50,
    minlength: 2,
  },
  position: {
    type: String,
    required: [true, 'Please provide Position'],
    maxlength: 50,
    minlength: 2,
  },
  achivements: {
    type: String,
    maxlength: 200,
    minlength: 2,
  },
  startDate: {
    type: Date,
    required: true,
  },
  currentCompany: {
    type: Boolean,
    default: false,
  },
});

// Combined Schema
const PortfolioSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide userId.'],
    },
    aboutMe: {
      type: String,
      required: [true, 'Please provide about me.'],
      minlength: 10,
      maxlength: 1000,
    },
    jobTitle: {
      type: [String],
      required: [true, 'Please provide job title.'],
    },
    socials: {
      type: {},
      default: { LinkedIn: '', Github: '', Instagram: '' },
    },
    skills: {
      type: [String],
      default: [],
    },
    workHistory: {
      type: [WorkHistorySchema],
      default: [],
    },
    template: {
      type: String,
      required: true,
      default: 'portifyInteractive',
    },
    portfolioLikes: {
      type: Number,
      default: 0,
    },
    portfolioLikedBy: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

const PortfolioModel = mongoose.model('Portfolio', PortfolioSchema);

export default PortfolioModel;
