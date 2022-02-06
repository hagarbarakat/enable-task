import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from './schemas/department.schema';
import { Seeder, DataFactory } from 'nestjs-seeder';

@Injectable()
export class DepartmentSeeder implements Seeder {
  constructor(
    @InjectModel(Department.name)
    private readonly department: Model<Department>,
  ) {}

  async seed(): Promise<any> {
    // Generate 2 departments.
    const departments = DataFactory.createForClass(Department).generate(2);

    // Insert into the database.
    return this.department.insertMany(departments);
  }

  async drop(): Promise<any> {
    return this.department.deleteMany({});
  }
}
