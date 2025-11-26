import { model, Schema } from 'mongoose';

export interface IUser {
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
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [50, 'Email cannot exceed 100 characters'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
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

export default model<IUser>('User', userSchema);
