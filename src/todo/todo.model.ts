import { Schema, Mongoose } from 'mongoose';
import ITodo from './todo.interface';

const todoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  text: { type: String },
  created: { type: Date, default: Date.now },
  modified: { type: Date },
  done: { type: Boolean, default: false }
});

export default (connection: Mongoose) =>
  connection.model<ITodo>('Todo', todoSchema);
