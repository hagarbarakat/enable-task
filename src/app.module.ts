import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { TaskController } from './task/task.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guards';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    UsersModule,
    DepartmentModule,
    MongooseModule.forRoot(
      'mongodb+srv://hagar:kWoMQ5bSaAexPrCR@cluster0.pwqk8.mongodb.net/enableDB?retryWrites=true&w=majority',
    ),
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
