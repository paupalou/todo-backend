import { Document } from 'mongoose';

export interface TodoParams extends Document {
  user: string;
  title: string;
  text?: string;
  created: Date;
  modified?: Date;
  done: boolean;
}

export default interface Todo extends TodoParams, Document {}
