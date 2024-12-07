import type { Request, Response } from 'express';
import { injectable } from 'inversify';

import settings from '@/config/settings';
import { ResponseResult } from '@/pojo/response-result';
import { AuthService } from '@/service/AuthService';

@injectable()
export class AuthController {

  public login(req: Request, res: Response) {
    const {username, password} = req.body;

    if (username === void 0 || password === void 0) {
      res.send(ResponseResult.error('用户名或密码不能为空'));
      return;
    }


    if (settings.ADMIN_USERNAME.toLowerCase() === username.toLowerCase() && settings.ADMIN_PASSWORD === password) {
      const token = 'Bearer ' + AuthService.generateToken({username});

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