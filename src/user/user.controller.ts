import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Schema as MongooseSchema } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createNewUser(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.DEPARTMENTMANAGER)
  async findAll(@Request() req): Promise<User[]> {
    return this.usersService.findAll(req.user);
  }

  @Get('/filter')
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.DEPARTMENTMANAGER)
  filterUsers(@Query() query: Record<string, any>, @Request() req) {
    return this.usersService.filterUsers(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: MongooseSchema.Types.ObjectId): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get(':email')
  findOnebyEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: MongooseSchema.Types.ObjectId): Promise<any> {
    return this.usersService.delete(id);
  }
}
