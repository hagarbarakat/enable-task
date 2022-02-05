import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type DepartmentDocument = Department & Document;

@Schema()
export class Department {

  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }],
  })
  users: User[];
  @Prop()
  location: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
