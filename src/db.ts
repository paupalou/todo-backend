import mongoose from 'mongoose';

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

const getConnection = async () => {
  const connection = await mongoose.connect(
    'mongodb://localhost:27017/todoApp',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  return connection;
};

export default getConnection;
