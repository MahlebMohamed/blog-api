import { model, Schema, Types } from 'mongoose';

interface Itoken {
  token: string;
  userId: Types.ObjectId;
}

const tokenModel = new Schema<Itoken>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export default model<Itoken>('Token', tokenModel);
