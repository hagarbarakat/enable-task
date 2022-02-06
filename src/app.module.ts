import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    DepartmentModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://hagar:kWoMQ5bSaAexPrCR@cluster0.pwqk8.mongodb.net/enableDB?retryWrites=true&w=majority',
    ),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}