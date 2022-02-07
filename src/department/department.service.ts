import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
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
import { Schema as MongooseSchema } from 'mongoose';
import { UserService } from '../user/user.service';
import { UpdateDepartmentDto } from './dto/updatedepartment.dto';
import { Role } from 'src/auth/enums/role.enum';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

Injectable();
export class DepartmentService {
  constructor(
    @InjectModel('Department')
    private readonly departmentModel: Model<Department>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  public async createNewDepartment(
    departmentDto: DepartmentDto,
  ): Promise<Department> {
    const newDepartment = new this.departmentModel(departmentDto);
    return newDepartment.save();
  }

  public async findAll(): Promise<Department[]> {
    return await this.departmentModel.find().populate('users').exec();
  }

  public async delete(id: MongooseSchema.Types.ObjectId): Promise<any> {
    const department = await this.departmentModel.findById(id).exec();
    //onsole.log(department)
    department.users.forEach((user) => {
      this.userService.removeDepartmentFromUser(user._id);
    });
    return await this.departmentModel.deleteOne({ _id: id }).exec();
  }

  public async findById(
    id: MongooseSchema.Types.ObjectId,
  ): Promise<Department> {
    return await this.departmentModel.findOne({ id: id }).exec();
  }

  public async addUserToDepartment(
    departmentId: MongooseSchema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<Department> {
    const department = await this.departmentModel
      .findOne({ _id: departmentId })
      .exec();
    if (department === null) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.addDepartmentToUser(
      updateUserDto,
      department,
    );
    this.checkUserInDepartment(department, user);
    department.users.push(user);
    return department.save();
  }

  private checkUserInDepartment(department: Department, user: User): void {
    department.users.forEach((u) => {
      if (u._id === user._id)
        throw new HttpException(
          'User already assigned to department',
          HttpStatus.CONFLICT,
        );
    });
  }

  public async updateDepartment(
    user,
    departmentId: MongooseSchema.Types.ObjectId,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    if (user.role === Role.DEPARTMENTMANAGER) {
      const userDetails = await this.userService.getUser(user.userId);
      this.validateUserDepartment(departmentId, userDetails);
    }
    const department = await this.departmentModel
      .findOne({ _id: departmentId })
      .exec();
    if (department === null) {
      throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (updateDepartmentDto.location) {
      department.location = updateDepartmentDto.location;
    }
    return department.save();
  }

  private validateUserDepartment(
    departmentId: MongooseSchema.Types.ObjectId,
    user: User,
  ): void {
    if (departmentId != user.department._id) {
      throw new HttpException(
        "CAN'T_UPDADE_THIS_DEPARTMENT",
        HttpStatus.FORBIDDEN,
      );
    }
  }

  public async getUsersByDepartmentId(
    id: MongooseSchema.Types.ObjectId,
  ): Promise<any> {
    return await this.departmentModel.findById(id).populate('users').exec();
  }

  public async removeUserFromDepartment(
    userId: MongooseSchema.Types.ObjectId,
    departmentId: MongooseSchema.Types.ObjectId,
  ) {
    const department = await this.departmentModel
      .findById(departmentId)
      .populate('users')
      .exec();
    const users = department.users.filter((user) => user._id !== userId);
    department.users.splice(0, department.users.length, ...users);
    return await department.save();
  }

}
