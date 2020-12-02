import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

interface IBoard {
  title: string;
  content: string;
  tag: string;
  user: number | IUser;
  done: boolean;
}

export interface IFoundPayload extends IBoard {
  foundDate: Date[];
  radioIndex: number;
  foundLocation: string;
  wantLocation: string;
}

export interface ILostPayload extends IBoard {
  lostDate: Date[];
  lostLocation: string;
}

export interface IMarketPayload extends IBoard {
  beforePrice: number;
  afterPrice: number;
  stars: number;
}

export interface IFound extends IBoard, Document {
  from: Date;
  to: Date;
  foundLocation: string;
  radioIndex: number;
  wantLocation: string;
}

export interface ILost extends IBoard, Document {
  from: Date;
  to: Date;
  lostLocation: string;
}

export interface IMarket extends IBoard, Document {
  beforePrice: number;
  afterPrice: number;
  stars: number;
}

export interface IFoundPopulated extends IFound {
  user: IUser;
}

export interface ILostPopulated extends ILost {
  user: IUser;
}

export interface IMarketPopulated extends IMarket {
  user: IUser;
}

const foundSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  foundLocation: { type: String, required: true },
  wantLocation: { type: String },
  radioIndex: { type: Number, required: true },
  done: { type: Boolean, default: false },
  tag: { type: String, required: true },
  user: { type: Number, ref: 'user' },
}, { versionKey: false, timestamps: true });

const lostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  lostLocation: { type: String, required: true },
  done: { type: Boolean, default: false },
  tag: { type: String, required: true },
  user: { type: Number, ref: 'user' },
}, { versionKey: false, timestamps: true });

const marketSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  beforePrice: { type: Number, required: true },
  afterPrice: { type: Number, required: true },
  stars: { type: Number, required: true },
  done: { type: Boolean, default: false },
  tag: { type: String, required: true },
  user: { type: Number, ref: 'user' },
}, { versionKey: false, timestamps: true });

export const Founds = mongoose.model<IFound>('found', foundSchema);
export const Losts = mongoose.model<ILost>('lost', lostSchema);
export const Markets = mongoose.model<IMarket>('market', marketSchema);
