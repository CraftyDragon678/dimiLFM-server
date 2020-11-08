import mongoose, { Document, Model, Schema } from 'mongoose';
import { randomBytes, pbkdf2Sync } from 'crypto';

export interface IUserPayload {
  uid: string;
  password: string;
  name: string;
  email: string;
  oid: number;
  serial: number;
  type: string;
}

export interface IUser extends IUserPayload, Document {
  id: string;
  createdAt: Date;
  verifyPassword: (password: string) => boolean;
}

export interface IUserModel extends Model<IUser> {
  createUser: (userPayload: IUserPayload) => void;
}

const userSchema = new Schema<IUser>({
  uid: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  oid: { type: Number, required: true },
  serial: { type: Number },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre<IUser>('save', function savePreHook(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = randomBytes(16).toString('base64');
  const encrypted = pbkdf2Sync(this.password, salt, 200000, 64, 'sha512').toString('base64');
  this.password = `${encrypted}|${salt}`;

  return next();
});

userSchema.methods.verifyPassword = function verify(password: string): boolean {
  const [encrypted, salt] = this.password.split('|');
  return encrypted === pbkdf2Sync(password, salt, 200000, 64, 'sha512').toString('base64');
};

userSchema.statics.createUser = async (userPayload: IUserPayload) => (
  // eslint-disable-next-line no-use-before-define
  new Users(userPayload).save()
);

const Users = mongoose.model<IUser, IUserModel>('user', userSchema);

export default Users;
