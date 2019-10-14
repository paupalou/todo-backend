import mongoose from 'mongoose';

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

const getConnection = (): Promise<mongoose.Mongoose> =>
  mongoose.connect('mongodb://db:27017/todoApp');

export default getConnection;
