import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT } from '../globals/globals.js';
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60,
  },
});

TokenSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(Number(BCRYPT_SALT));
  this.token = await bcrypt.hash(this.token, salt);
});
TokenSchema.methods.compareToken = async function (candidateToken) {
  const isMatch = await bcrypt.compare(candidateToken, this.token);
  return isMatch;
};
const Token = mongoose.model('Token', TokenSchema);

export default Token;
