import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { Task } from './schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';

Injectable()
export class TaskService {
  constructor(@InjectModel('') private readonly taskModel: Model<Task>) {}
  
  // async findbyUserID(): Promise<TaskDto> {

  // }

}