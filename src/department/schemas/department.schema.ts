import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Factory } from 'nestjs-seeder';

export type DepartmentDocument = Department & Document;

@Schema()
export class Department {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  @Factory((faker) => faker.name.findName())
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true}],
    sparse: true,
  })
  users: User[];

  @Prop()
  location: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
