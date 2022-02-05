import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  HttpStatus,
  Inject,
  forwardRef,
  HttpException,
} from '@nestjs/common';
import { DepartmentDto } from './dto/department.dto';
import { Department } from './schemas/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Schema as MongooseSchema } from 'mongoose';
import { UserService } from '../user/user.service';
import { UpdateDepartmentDto } from './dto/updatedepartment.dto';
import { Role } from 'src/auth/enums/role.enum';
import { User, UserDocument } from 'src/user/schemas/user.schema';

Injectable();
export class DepartmentService {
  constructor(
    @InjectModel('Department')
    private readonly departmentModel: Model<Department>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async createNewDepartment(departmentDto: DepartmentDto): Promise<Department> {
    const newDepartment = new this.departmentModel(departmentDto);
    return await newDepartment.save();
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentModel.find().exec();
  }

  async delete(id: MongooseSchema.Types.ObjectId): Promise<any> {
    return await this.departmentModel.deleteOne({ _id: id }).exec();
  }

  async findById(id: MongooseSchema.Types.ObjectId): Promise<Department> {
    return await this.departmentModel.findOne({ id: id }).exec();
  }

  async assign(
    id: MongooseSchema.Types.ObjectId,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.departmentModel.findOne({ _id: id }).exec();
    if (department) {
      const user = await this.userService.getAssigned(
        updateDepartmentDto,
        department,
      );
      department.users.push(user);
      try {
        return await department.save();
      } catch (error) {
        throw new HttpException(
          'User already assigned to department',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async updateDepartment(
    user,
    id: MongooseSchema.Types.ObjectId,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    if (user.role === Role.DEPARTMENTMANAGER) {
      const userDetails = await this.userService.getUserDetails(user.userId);      
      if (user.userId != userDetails._id) {
        throw new HttpException(
          "CAN'T_UPDADE_THIS_DEPARTMENT",
          HttpStatus.FORBIDDEN,
        );
      }
      console.log(userDetails);
    }
    const department = await this.departmentModel.findOne({ _id: id }).exec();
    if (department) {
      if (updateDepartmentDto.location) {
        department.location = updateDepartmentDto.location;
      }
      return await department.save();
    } else {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
  async getUsersDep(id): Promise<any> {
    return await this.departmentModel.findById(id).populate('users').exec();
  }
}
