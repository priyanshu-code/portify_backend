import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema(
  {
    templateName: {
      type: String,
      unique: [true, 'Template with the same name already exists please choose a different Name'],
      required: [true, 'Please provide template Name'],
      maxlength: 50,
      minlength: 1,
    },
    author: {
      type: String,
      required: [true, 'Please provide Author'],
      maxlength: 60,
      minlength: 1,
    },
    templateImage: {
      type: String,
      required: [true, 'Please provide template Image'],
    },
    stars: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Template = mongoose.model('Template', TemplateSchema);

export default Template;
