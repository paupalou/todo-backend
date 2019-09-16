import { Schema, Mongoose } from 'mongoose';
import IUser from './user.interface';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  created: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator, { message: 'cannot use that username' });

const UserFactory = (connection: Mongoose) => {
  const collectionName = 'User';
  const schema = userSchema;
  const userModel = connection.model<IUser>(collectionName, schema);

  return {
    model: userModel,
    create: (params: IUser) => {
      const user = new userModel(params);
      return user.save();
    }
  };
};

export default UserFactory;
