import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import IUser from './interface';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  created: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator, { message: 'cannot use that username' });

export { userSchema };
export default mongoose.model<IUser>('User', userSchema);
