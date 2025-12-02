import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    x?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxLength: [30, 'Username cannot exceed 30 characters'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [50, 'Email cannot exceed 50 characters'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} must be either user or admin',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [20, 'First name cannot exceed 20 characters'],
    },
    lastName: {
      type: String,
      maxLength: [20, 'Last name cannot exceed 20 characters'],
    },
    socialLinks: {
      website: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      x: { type: String },
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

export default model<IUser>('User', userSchema);
