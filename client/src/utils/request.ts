import axios from 'axios';
import { ElMessage } from 'element-plus';

import { LocalStorageKey } from '@/config/channel_key';

import LocalStorageUtil from './LocalStorageUtil';

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASEURL,
  timeout: 5000,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});


request.interceptors.request.use(config => {
  const jwt = LocalStorageUtil.get<string>(LocalStorageKey.JWT);

  if (jwt) {
    config.headers['Authorization'] = jwt;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

request.interceptors.response.use(response => {
  // bolob类型直接返回 response


  const data = response.data;
  const { code } = data;
  switch (code) {
    case RESPONSE_CODE.SUCCESS:
      break;
    case RESPONSE_CODE.ERROR:
      ElMessage.error(data.message);
      break;
  }

  // 直接返回数据
  return response.data;
}, error => {
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！';
        location.href = '/login.html';
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break;
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务器内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP 版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  return Promise.reject(message);
});

export default request;


export enum RESPONSE_CODE {
  /**
   * @description
   * 接口请求成功
   */
  SUCCESS = 0,

  /**
   * @description
   * 运行异常
   */
  ERROR = -1,

  /**
   * @description
   * 操作失败,业务异常
   */
  BUSINESS_ERROR = 4,

  /**
   * @description
   * 账户锁定,请联系管理员
   */
  ACCOUNT_LOCKED = 400001001,

  /**
   * @description
   * 登录名或密码不正确
   */
  LOGINNAME_PASSWORD_WRONG = 400001002,

  /**
   * @description
   * 账户未启用,请联系管理员
   */
  ACCOUT_NOT_ENABLE = 400001003,

  /**
   * @description
   * token已过期
   */
  ACCESS_TOKEN_INVALID = 400001006,
  /**
   * @description
   * 刷新refreshToken已过期
   */
  LOGIN_TOKEN_INVALID = 400001004,

  /**
   * @description
   * 访问未授权
   */
  UNAUTHORIZED_ACCESS = 400001007,

  /**
   * @description
   * 验证码失效
   */
  CODE_OVERTIME = 400002001,

  /**
   * @description
   * 验证码不匹配
   */
  CODE_WRONG = 400002002,

  /**
   * @description
   * 首次登录,请修改初始密码
   */
  CHANGE_INIT_PASSWORD = 400003001,

  /**
   * @description
   * 登录密码已过期,请修改密码
   */
  PASSWORD_EXPIRED = 400003002,
}
