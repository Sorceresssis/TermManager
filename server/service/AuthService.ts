import jwt from 'jsonwebtoken';

import { loadEnv } from '../utils/dotenvUtil';

loadEnv();

export class AuthService {
  private static secretKey = process.env.JWT_SECRET || 'default_secret_key';

  public static generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: 60 * 60 * 24,
    });
  }

  public static verifyToken(token: string): object | string {
    try {
      return jwt.verify(token, this.secretKey); // 如果验证通过，返回解密后的数据
    } catch {
      throw new Error('Invalid token');
    }
  }
}
