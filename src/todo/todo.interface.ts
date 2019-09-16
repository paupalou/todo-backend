import { Document } from 'mongoose';

export default interface ITodo extends Document {
  user: string;
  title: string;
  text?: string;
  created: Date;
  modified?: Date;
  done: boolean;
}
