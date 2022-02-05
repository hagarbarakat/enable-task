import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { Task } from 'src/task/schemas/task.schema';
import { ObjectId } from 'mongoose';
import { Department } from 'src/department/schemas/department.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', unique: true }],
  })
  tasks: Task[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  })
  department: Department;

  @Prop({ type: String, enum: Role, default: Role.EMPLOYEE })
  role: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
