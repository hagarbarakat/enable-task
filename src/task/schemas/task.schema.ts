import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
  users: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);