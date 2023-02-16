import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { IScore } from '../../types/interfaces/score';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as UUIDv4 } from 'uuid';

@Schema({ collection: 'scores' })
export class Score extends Document implements IScore {
  @Prop({
    type: String,
    isRequired: true,
    default: UUIDv4,
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
