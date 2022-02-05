import { IsNotEmpty } from 'class-validator';

export class UpdateDepartmentDto {

  @IsNotEmpty()
  username: string;
  location: string;
}
