import type { Request, Response } from 'express';
import { injectable } from 'inversify';

import { ResponseResult } from '../dto/ResponseResults';
import { AuthService } from '../service/AuthService';
import { loadEnv } from '../utils/dotenvUtil';

loadEnv();


@injectable()
export class AuthController {

  public login(req: Request, res: Response) {
    const {username, password} = req.body;

    if (username === void 0 || password === void 0) {
      res.send(ResponseResult.error('用户名或密码不能为空'));
      return;
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (ADMIN_USERNAME === void 0 || ADMIN_PASSWORD === void 0) {
      res.send(ResponseResult.error('服务器错误'));
      throw new Error('请配置用户名和密码');
    }

    if (ADMIN_USERNAME.toLowerCase() === username.toLowerCase() && ADMIN_PASSWORD === password) {
      const token = 'Bearer ' + AuthService.generateToken({
        username,
      });

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.send(ResponseResult.success(token, '登录成功'));
    } else {
      res.send(ResponseResult.error('用户名或密码错误'));
    }
  }
}