import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  Injectable,
  HttpStatus,
  HttpException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Schema as MongooseSchema } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Department } from 'src/department/schemas/department.schema';
import { DepartmentService } from 'src/department/department.service';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => DepartmentService))
    private departmentService: DepartmentService,
  ) {}

  async findAll(user): Promise<User[]> {
    if (user.role === Role.SUPERADMIN)
      return await this.userModel.find().exec();
    else {
      const dep = await this.getUser(user.userId);
      return await this.departmentService.getUsersByDepartmentId(
        dep.department[0]._id,
      );
    }
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  public async findById(id: MongooseSchema.Types.ObjectId): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  public async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  public async delete(id: MongooseSchema.Types.ObjectId): Promise<any> {
    const user = await this.userModel
      .findById(id)
      .populate('department')
      .exec();
    this.departmentService.removeUserFromDepartment(
      user._id,
      user.department[0]._id,
    );
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  public async createNewUser(createUserDto: CreateUserDto): Promise<User> {
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
    const user = await this.findByUsername(username);
    if (user) {
      throw new ConflictException('Username already exists');
    }
  }

  public async addDepartmentToUser(
    updateUserDto: UpdateUserDto,
    department: Department,
  ): Promise<User> {
    const user = await this.userModel
      .findOne({ username: updateUserDto.username })
      .exec();
    user.department = department;
    return user.save();
  }

  async getUser(id: string): Promise<User> {
    return await this.userModel.findById(id).populate('department').exec();
  }

  public async filterUsers(query: Record<string, any>, user): Promise<User[]> {
    if (user.role === Role.DEPARTMENTMANAGER) {
      const dep = await this.getUser(user.userId);
      return await this.userModel
        .find(query)
        .where('department')
        .equals(dep.department[0]._id)
        .exec();
    } else {
      return this.userModel.find(query).exec();
    }
  }
  public async removeDepartmentFromUser(userId: MongooseSchema.Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    user.department = undefined;
    user.save();
  }
}
