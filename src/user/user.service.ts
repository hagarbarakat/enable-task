import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Schema as MongooseSchema } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Department } from 'src/department/schemas/department.schema';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findAll(user): Promise<User[]> {
    if (user.role === Role.SUPERADMIN)
      return await this.userModel.find().exec();
    else {
      return await this.userModel
        .find({ _id: user.userID })
        .populate('department', null, Department.name)
        .exec();
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findById(id: MongooseSchema.Types.ObjectId): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  async delete(id: MongooseSchema.Types.ObjectId): Promise<any> {
    return await this.userModel.deleteOne({ _id: id }).exec();
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<User> {
    await this.validateUserEmail(createUserDto.email);
    await this.validateUserUsername(createUserDto.username);
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  private async validateUserEmail(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }
  private async validateUserUsername(username: string): Promise<void> {
    const user = await this.findOne(username);
    if (user) {
      throw new ConflictException('Username already exists');
    }
  }

  async getAssigned(
    updateUserDto: UpdateUserDto,
    department: Department,
  ): Promise<User> {
    const user = await this.userModel
      .findOne({ username: updateUserDto.username })
      .exec();
    if (user) {
      user.department = department;
      return user.save();
    } else {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async getUserDetails(id) {
    await this.userModel
      .findById(id)
      .populate('department', null, Department.name)
      .exec();
  }
}
