import { getConfig } from '@/utils/config';
import request from '@/utils/request';

const { FEISHU_CONFIG } = getConfig();

const { BASE_URL, APP_ID, APP_SECRET } = FEISHU_CONFIG;

//请求商品基本配置
const baseOptions = ({
  authorization = 'feishutoken',
  baseURL = BASE_URL,
}: {
  authorization?: string; // app_access_token
  baseURL?: string;
}) => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
  };

  if (authorization) {
    headers['Authorization'] = authorization;
  }

  return {
    baseURL,
    headers,
  };
};

export const getTenantAccessToken = async () => {
  return request({
    ...baseOptions({}),
    url: `/auth/v3/tenant_access_token/internal`,
    method: 'POST',
    data: {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    },
  });
};

export const getAppAccessToken = async () => {
  return request({
    ...baseOptions({}),
    url: `/auth/v3/app_access_token/internal`,
    method: 'POST',
    data: {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    },
  });
};

export const getUserAccessToken = async ({
  grant_type = 'authorization_code',
  code,
}: {
  grant_type: string; //授权类型，固定值 示例值："authorization_code"
  code: string; // 登录预授权码，调用登录预授权码 获取code 示例值："xMSldislSkdK"
}) => {
  return request({
    ...baseOptions({}),
    url: `/authen/v1/oidc/access_token`,
    method: 'POST',
    data: {
      grant_type,
      code,
    },
  });
};

// /**
//  * @description: 获取用户 token
//  */
// export const getUserToken = async ({
//   grant_type = 'authorization_code',
//   code,
// }: {
//   grant_type: string;
//   code: string;
// }) => {
//   return request({
//     ...baseOptions({}),
//     url: `/authen/v1/access_token`,
//     method: 'POST',
//     data: {
//       grant_type,
//       code,
//     },
//   });
// };

// /**
//  * @description: 刷新用户 token
//  */
// export const refreshUserToken = async ({
//   grant_type = 'refresh_token',
//   refresh_token,
//   app_token,
// }: {
//   grant_type: string;
//   refresh_token: string;
//   app_token: string;
// }) => {
//   return request({
//     ...baseOptions({}),
//     url: `/authen/v1/refresh_access_token`,
//     method: 'POST',
//     data: {
//       grant_type,
//       refresh_token,
//       app_token,
//     },
//   });
// };

// /**
//  * @description: 获取用户 access token
//  */
// export const getUserAccessToken = async ({
//   grant_type = 'authorization_code',
//   code,
// }: {
//   grant_type: string;
//   code: string;
//   app_id: string;
//   app_secret: string;
// }) => {
//   return request({
//     ...baseOptions({}),
//     url: `/suite/passport/oauth/token`,
//     method: 'POST',
//     data: {
//       grant_type,
//       code,
//       app_id: APP_ID,
//       app_secret: APP_SECRET,
//     },
//   });
// };

// /**
//  * @description: 获取应用 token
//  */
// export const getAppToken = async () => {
//   return request({
//     ...baseOptions({}),
//     url: `/auth/v3/app_access_token/internal`,
//     method: 'POST',
//     data: {
//       app_id: APP_ID,
//       app_secret: APP_SECRET,
//     },
//   });
// };
