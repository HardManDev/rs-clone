import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { IScore } from '../../types/interfaces/score';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'scores' })
export class Score extends Document implements IScore {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    isRequired: true,
    default: Types.ObjectId,
  })
  _id: string;
  @Prop({
    ref: 'User',
    type: MongooseSchema.Types.ObjectId,
    isRequired: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Number,
    isRequired: true,
    default: 0,
    index: true,
  })
  score: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt?: Date;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
ScoreSchema.index({ user: 1, score: 1 }, { unique: true });
