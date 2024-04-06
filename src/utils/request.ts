import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { getConfig } from '@/utils/config';

const {
  FEISHU_CONFIG: { FEISHU_URL },
} = getConfig();

const request = axios.create({
  // API 请求的默认前缀
  // baseURL: VITE_APP_BASE_URL as string,
  // baseURL: '/',
  timeout: 100000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error: AxiosError) => {
  const status = error.response?.status;
  switch (status) {
    /* eslint-disable no-param-reassign */
    case 400:
      error.message = '请求错误';
      break;
    case 401:
      // 退出登录
      error.message = '未授权，请登录';
      break;
    case 403:
      // 退出登录
      error.message = '拒绝访问';
      break;
    case 404:
      error.message = `请求地址出错: ${error.response?.config.url}`;
      break;
    case 408:
      error.message = '请求超时';
      break;
    case 422:
      error.message = '登录超时';
      // globalStore.refreshToken = true;
      break;
    case 500:
      error.message = '服务器内部错误';
      break;
    case 501:
      error.message = '服务未实现';
      break;
    case 502:
      error.message = '网关错误';
      break;
    case 503:
      error.message = '服务不可用';
      break;
    case 504:
      error.message = '网关超时';
      break;
    case 505:
      error.message = 'HTTP版本不受支持';
      break;
    case -403:
      // login error
      // 退出登录
      break;
    default:
      break;
  }
  if (error.message) {
    const skipErrorCodes: any[] = [-403];
    if (!skipErrorCodes.includes(status)) {
      //   notification.error({ message: error.message });
    }
  }

  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
  // config.headers.Authorization = `Bearer ${storage.get(STORAGE_SESSION_ID)}` // jwt,  改为写到每一个 api 模块中
  if (config.method === 'post') {
    const formData = new FormData();
    if (config.data) {
      Object.keys(config.data).forEach((key) => {
        formData.append(key, config.data[key]);
      });
      config.data = formData;
    }
  }

  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response: AxiosResponse) => {
  const dataAxios = response;
  // 这个状态码是和后端约定的
  const { data, code, msg } = dataAxios.data;
  // 根据 code 进行判断
  if (code === undefined) {
    // 如果没有 code 代表这不是项目后端开发的接口
    return dataAxios;
  }
  // 有 code 代表这是一个后端接口 可以进行进一步的判断
  switch (true) {
    case /^000000$/.test(code):
      return dataAxios;
    case /^100000$/.test(code):
      return dataAxios;
    case /^200[0-9]{3}$/.test(code):
      return dataAxios;
    case /^422[0-9]{3}$/.test(code):
      return errorHandler({
        response: {
          status: 422, // 这是 number 类型
        },
        message: msg,
      } as AxiosError);
    case /^0$/.test(code):
      // code === 0 代表没有错误
      return dataAxios;
    case /^200$/.test(code):
      // [ 示例 ] code === 200 代表没有错误
      return dataAxios;
    default:
      // 不是正确的 code
      return errorHandler({
        response: {
          // status: code   // 这是 number 类型
          statusText: code, // 这是 string 类型
          data,
        },
        message: msg,
      } as AxiosError);
  }
}, errorHandler);

export default request;

// /**
//  * @description: 任意请求
//  */
// const request = async ({ url, option = {} }) => {
//   try {
//     return axios.request({
//       url,
//       ...option,
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// interface IMethodV {
//   url: string;
//   method?: Method;
//   headers?: { [key: string]: string };
//   params?: Record<string, unknown>;
//   query?: Record<string, unknown>;
// }

// export interface IRequest {
//   data: any;
//   code: number;
// }

// /**
//  * @description: 带 version 的通用 api 请求
//  */
// const methodV = async ({
//   url,
//   method,
//   headers,
//   params = {},
//   query = {},
// }: IMethodV): Promise<IRequest> => {
//   let sendUrl = '';
//   if (/^(http:\/\/|https:\/\/)/.test(url)) {
//     sendUrl = url;
//   } else {
//     sendUrl = `${FEISHU_URL}${url}`;
//   }
//   try {
//     return new Promise((resolve, reject) => {
//       axios({
//         headers: {
//           'Content-Type': 'application/json; charset=utf-8',
//           ...headers,
//         },
//         url: sendUrl,
//         method,
//         params: query,
//         data: {
//           ...params,
//         },
//       })
//         .then(({ data, status }) => {
//           resolve({ data, code: status });
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// export { request, methodV };
