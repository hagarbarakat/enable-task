import { Document } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { Task } from 'src/task/schemas/task.schema';

export interface User extends Document{
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles: Role[];
  department: string; 
  tasks: Task[];
}