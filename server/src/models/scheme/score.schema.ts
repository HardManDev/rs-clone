import { Document } from 'mongoose';
import { IScore } from '../../types/interfaces/score';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { v4 as UUIDv4 } from 'uuid';
import { Ref } from '@typegoose/typegoose';
import { User } from './user.schema';

export class Score extends Document implements IScore {
  @Prop({
    type: String,
    isRequired: true,
    default: UUIDv4,
  })
  _id: string;

  @Prop({
    type: Number,
    isRequired: true,
    default: 0,
    index: true,
  })
  score: number;

  @Prop()
  user: Ref<User>;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
