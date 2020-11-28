import mongoose, { Document, isValidObjectId, Schema } from 'mongoose';
import { IUser } from './userModel';

interface IBoard {
  title: string;
  content: string;
}

export interface IFoundPayload extends IBoard {
  foundDate: Date[];
  radioIndex: number;
  foundLocation: string;
  wantLocation: string;
}

export interface ILostPayload extends IBoard {
  foundDate: Date[];
  foundLocation: string;
}

export interface IMarketPayload extends IBoard {
  beforePrice: bigint;
  afterPrice: bigint;
  stars: number;
}

export interface IFound extends IBoard, Document {
  from: Date;
  to: Date;
  foundLocation: string;
  radioIndex: number;
  wantLocation: string;
  user: number | IUser;
}

export interface ILost extends IBoard, Document {
  from: Date;
  to: Date;
  lostLocation: string;
  user: number | IUser;
}

export interface IMarket extends IBoard, Document {
  beforePrice: string;
  afterPrice: string;
  stars: number;
  user: number | IUser;
}

const foundSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  foundLocation: { type: String, required: true },
  wantLocation: { type: String },
  radioIndex: { type: Number, required: true },
  user: { type: Number, ref: 'user' },
}, { versionKey: false, timestamps: true });

const lostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  lostLocation: { type: String, required: true },
  user: { type: Number, ref: 'user' },
}, { versionKey: false, timestamps: true });

const marketSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  beforePrice: { type: String, required: true },
  afterPrice: { type: String, required: true },
  stars: { type: Number, required: true },
  user: { type: Number, ref: 'user' },
}, { versionKey: false, timestamps: true });

export const Founds = mongoose.model<IFound>('found', foundSchema);
export const Losts = mongoose.model<ILost>('lost', lostSchema);
export const Markets = mongoose.model<IMarket>('market', marketSchema);
