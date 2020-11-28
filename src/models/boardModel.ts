import mongoose, { Document, Schema } from 'mongoose';

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
  wantLocation: string;
}

export interface ILost extends IBoard, Document {
  from: Date;
  to: Date;
  lostLocation: string;
}

export interface IMarket extends IBoard, Document {
  beforePrice: string;
  afterPrice: string;
  stars: number;
}

const foundSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  foundLocation: { type: String, required: true },
  wantLocation: { type: String, required: true },
}, { versionKey: false, timestamps: true });

const lostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  lostLocation: { type: String, required: true },
}, { versionKey: false, timestamps: true });

const marketSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  beforePrice: { type: String, required: true },
  afterPrice: { type: String, required: true },
  stars: { type: Number, required: true },
}, { versionKey: false, timestamps: true });

export const Founds = mongoose.model<IFound>('found', foundSchema);
export const Losts = mongoose.model<ILost>('lost', lostSchema);
export const Markets = mongoose.model<IMarket>('market', marketSchema);
