import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Câu hỏi của người dùng không được để trống' })
  userQuestion: string;

  @IsString()
  @IsNotEmpty({ message: 'Câu trả lời của bot không được để trống' })
  botAnswer: string;

  @IsString()
  @IsNotEmpty({ message: 'Lý do báo cáo không được để trống' })
  reason: string; // "OUTDATED_PRICE", "CLOSED", "INCORRECT_INFO", "OTHER"

  @IsOptional()
  @IsString()
  userNote?: string;
}
