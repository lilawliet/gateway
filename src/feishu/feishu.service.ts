import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { getTenantAccessToken, sendMessage } from '@/helpers/feishu/auth';
import { BusinessException } from '@/common/interceptors/exceptions/business.exception';

@Injectable()
export class FeishuService {
  private APP_TOKEN_CACHE_KEY;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
  }

  async getAppToken() {
    let appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY);
    if (!appToken) {
      const resp = await getTenantAccessToken();
      console.log('getAppToken', resp);
      if (resp.data.code === 0) {
        appToken = resp.data.tenant_access_token;
        this.cacheManager.set(
          this.APP_TOKEN_CACHE_KEY,
          appToken,
          resp.data.expire - 60,
        );
      } else {
        throw new BusinessException(resp.data.msg);
      }
    }
    return appToken;
  }

  async sendMessage(receive_id_type, params) {
    const appToken = await this.getAppToken();

    return sendMessage({
      receive_id_type,
      params,
      app_token: appToken as string,
    });
  }
}
