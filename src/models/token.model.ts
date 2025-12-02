import { model, Schema, Types } from 'mongoose';

interface Itoken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<Itoken>({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
});

export default model<Itoken>('Token', tokenSchema);
