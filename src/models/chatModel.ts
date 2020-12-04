import {
  Document, model, Schema, Types,
} from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUser } from './userModel';
import { IFound, ILost, IMarket } from './boardModel';

export interface IChatPayload {
  chatId: string;
  messageType: string;
  content: unknown;
}

interface IChat extends Document {
  from: number | IUser;
  to: number | IUser;
  refBoardType: 'found' | 'lost' | 'market' | 'book';
  ref: string | ObjectId | IFound | ILost | IMarket;
  messages: {
    from: boolean;
    type: string;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}

export interface IChatPopulated extends IChat {
  from: IUser;
  to: IUser;
  ref: IFound | ILost | IMarket;
}

const messageSchema = new Schema({
  from: { type: Boolean, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const chatSchema = new Schema({
  from: { type: Number, ref: 'user', required: true },
  to: { type: Number, ref: 'user', required: true },
  refBoardType: { type: String, enum: ['found', 'lost', 'market', 'book'], required: true },
  ref: { type: Types.ObjectId, refPath: 'refBoardType', required: true },
  messages: { type: [messageSchema], default: [] },
}, { versionKey: false, timestamps: true });

export const Chats = model<IChat>('chat', chatSchema);
