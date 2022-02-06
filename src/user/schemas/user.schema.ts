import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { Task } from 'src/task/schemas/task.schema';
import { ObjectId } from 'mongoose';
import {
  Department,
  DepartmentSchema,
} from 'src/department/schemas/department.schema';
import { Factory } from 'nestjs-seeder';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true })
  @Factory((faker) => faker.name.findName())
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  @Factory((faker) => faker.name.findName())
  username: string;

  @Prop({ required: true })
  @Factory('$2b$10$iSNZZtijowrzPHMwvWrPE.CywY.Fu4X39ktfZ7EBfRa0LoKjRF.fu') //1234567
  password: string;

  @Prop({ required: true, unique: true })
  @Factory((faker) => faker.internet.email())
  email: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', sparse: true }],
    sparse: true
  })
  tasks: Task[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Department.name,
  })
  department: Department;

  @Prop({ type: String, enum: Role })
  @Factory('superadmin')
  role: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
