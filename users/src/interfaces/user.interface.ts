import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}

export interface IUserInput {
  name: string;
  email: string;
}
