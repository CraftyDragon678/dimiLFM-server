import mongoose, { Document, Model, Schema } from 'mongoose';
import { randomBytes, pbkdf2Sync } from 'crypto';

export interface IUserPayload {
  _id: number;
  uid: string;
  password: string;
  name: string;
  email: string;
  serial: number;
  type: string;
  profileimage: string;
}

export interface IUser extends IUserPayload, Document {
  _id: number;
  createdAt: Date;
  verifyPassword: (password: string) => boolean;
}

export interface IUserModel extends Model<IUser> {
  createUser: (userPayload: IUserPayload) => void;
}

const userSchema = new Schema<IUser>({
  _id: { type: Number, required: true },
  uid: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  serial: { type: Number },
  type: { type: String, required: true },
  profileimage: { type: String },
}, { versionKey: false, timestamps: true });

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
