import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Department,
  DepartmentSchema,
} from './department/schemas/department.schema';
import { DepartmentSeeder } from './department/department.seeder';
import { User, UserSchema } from './user/schemas/user.schema';
import { UsersSeeder } from './user/user.seeder';

seeder({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://hagar:kWoMQ5bSaAexPrCR@cluster0.pwqk8.mongodb.net/enableDB?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }, { name: Department.name, schema: DepartmentSchema }],
    ),
  ],
}).run([UsersSeeder, DepartmentSeeder]);
