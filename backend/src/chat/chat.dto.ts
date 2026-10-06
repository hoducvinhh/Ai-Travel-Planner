import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty({ message: 'Nội dung câu hỏi không được để trống' })
  message: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;
}

export class UpdateSessionDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;
}
