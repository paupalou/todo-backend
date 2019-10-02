import { Document } from 'mongoose';

export interface UserParams {
  username: string;
  created?: Date;
}

export default interface User extends UserParams, Document {}
