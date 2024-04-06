import {
  Controller,
  Body,
  Post,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { FeishuService } from './feishu.service';
import { FeishuMessageDto } from './dto/feishui.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('飞书')
@Controller({
  path: 'feishu',
  version: '1',
})
export class FeishuController {
  constructor(private readonly feishuService: FeishuService) {}

  @ApiOperation({ summary: '发送飞书消息' })
  @Version([VERSION_NEUTRAL])
  @Post('sendMessage')
  sendMessage(@Body() params: FeishuMessageDto) {
    const { receive_id_type, ...rest } = params;
    return this.feishuService.sendMessage(receive_id_type, rest);
  }
}
