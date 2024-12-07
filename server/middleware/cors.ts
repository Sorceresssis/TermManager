import type{ NextFunction, Request, Response } from 'express';

export function cors(req: Request, res: Response, next: NextFunction) {
  const referer = req.headers.referer;
  if (referer) {
    const origin = referer.replace(/\/$/, '');
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '3600');
  res.header('Access-Control-Allow-Headers', 'Authorization, Accept, Origin, X-Requested-With, Content-Type, Last-Modified');
  next();
}