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


export class ResponseResult<T> {
  public constructor(
    public code: number,
    public msg: string,
    public hint: string,
    public data: T | null,
    public success: boolean
  ) {
  }

  public static success<T>(data: T | null = null, msg: string = '', hint: string = ''): ResponseResult<T> {
    return new ResponseResult<T>(RESPONSE_CODE.SUCCESS, msg, hint, data, true);
  }

  public static error<T>(msg: string = '', code: number = RESPONSE_CODE.ERROR, hint: string = ''): ResponseResult<T> {
    return new ResponseResult<T>(code, msg, hint, null, false);
  }
}
