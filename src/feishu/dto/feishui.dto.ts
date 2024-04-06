import { MESSAGE_TYPE, RECEIVE_TYPE } from '@/helpers/feishu/auth';
import { ApiProperty } from '@nestjs/swagger';

export class FeishuMessageDto {
  @ApiProperty({ example: 'email' })
  receive_id_type: RECEIVE_TYPE;

  @ApiProperty({ example: '251754731@qq.com' })
  receive_id: string;

  @ApiProperty({ example: '{"text":"test content"}' })
  content: string;

  @ApiProperty({ example: 'text', enum: MESSAGE_TYPE })
  msg_type?: MESSAGE_TYPE;
}
