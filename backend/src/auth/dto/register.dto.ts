import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  name?: string;

  @IsOptional()
  @IsArray({ message: 'Sở thích du lịch phải là mảng chuỗi' })
  preferredStyles?: string[];

  @IsOptional()
  @IsString()
  budgetLevel?: string;
}
