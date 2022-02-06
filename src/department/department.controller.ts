import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { DepartmentDto } from './dto/department.dto';
import { DepartmentService } from './department.service';
import { Department } from './schemas/department.schema';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Schema as MongooseSchema } from 'mongoose';
import { UpdateDepartmentDto } from './dto/updatedepartment.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';


@Controller('department')
@UseGuards(RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiBody({ type: [DepartmentDto] })
  create(@Body() departmentDto: DepartmentDto): Promise<Department> {
    return this.departmentService.createNewDepartment(departmentDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN)
  findOne(@Param('id') id: MongooseSchema.Types.ObjectId): Promise<Department> {
    return this.departmentService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: MongooseSchema.Types.ObjectId): Promise<any> {
    return this.departmentService.delete(id);
  }

  @Put('assign-user/:id')
  @Roles(Role.SUPERADMIN)
  @ApiBody({ type: [UpdateUserDto] })
  assignUser(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Department> {
    return this.departmentService.addUserToDepartment(id, updateUserDto);
  }

  @Put(':id')
  @Roles(Role.SUPERADMIN, Role.DEPARTMENTMANAGER)
  @ApiBody({ type: [UpdateDepartmentDto] })
  updateDepartment(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Request() req,
  ): Promise<Department> {
    return this.departmentService.updateDepartment(
      req.user,
      id,
      updateDepartmentDto,
    );
  }
}
