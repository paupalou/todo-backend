import { Schema, Mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  created: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator, { message: 'cannot use that username' });

export default (connection: Mongoose) => connection.model('User', userSchema);
