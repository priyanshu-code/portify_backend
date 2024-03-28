import mongoose from 'mongoose';
const AWSDetailsSchema = new mongoose.Schema(
  {
    totalImages: {
      type: Number,
      default: 0,
    },
    totalStorageUsed: {
      type: String,
      default: '0',
    },
    postRequestsThisMonth: {
      type: Number,
      default: '0',
    },
    totalPostRequests: {
      type: Number,
      default: '0',
    },
    toBeDeletedImages: {
      type: [String],
      default: [],
    },
    actualDeleteRequests: {
      type: Number,
      default: '0',
    },
    deleteRequestsThisMonth: {
      type: Number,
      default: '0',
    },
    totalDeleteRequests: {
      type: Number,
      default: '0',
    },
  },
  { timestamps: true }
);

const AWSModel = mongoose.model('AWS', AWSDetailsSchema);

export default AWSModel;
