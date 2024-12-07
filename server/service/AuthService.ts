import jwt from 'jsonwebtoken';

import settings from '@/config/settings';
export class AuthService {
  private static secretKey = settings.JWT_SECRET;

  public static generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, {expiresIn: 60 * 60 * 24});
  }

  public static verifyToken(token: string): object | string {
    try {
      return jwt.verify(token, this.secretKey); // 如果验证通过，返回解密后的数据
    } catch {
      throw new Error('Invalid token');
    }
  }
}
