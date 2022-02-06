import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { Task } from 'src/task/schemas/task.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  tasks: Task[];

  @ApiProperty()
  department: string;
   
  @ApiProperty()
  role: Role[];
}
