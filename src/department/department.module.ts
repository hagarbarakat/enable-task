import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { UsersModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeatureAsync([
      {
        name: Department.name,
        useFactory: () => {
          const schema = DepartmentSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}
