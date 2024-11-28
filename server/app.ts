import os from 'node:os';

import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import config from './config';
import { type AuthController } from './controller/AuthController';
import { type OpenInVscodeController } from './controller/OpenInVscodeController';
import { type SecondCategoryController } from './controller/SecondCategoryController';
import { type TagController } from './controller/TagController';
import { type TagExplanationController } from './controller/TagExplanationController';
import { type TopCategoryController } from './controller/TopCategoryController';
import { ResponseResult } from './dto/ResponseResults';
import { authMiddleware } from './middleware/AuthMiddleware';
import injectType from './provider/injectType';
import provider from './provider/provider';
import type ClientService from './service/ClientService';
import { loadEnv } from './utils/dotenvUtil';

function CORS(req: Request, res: Response, next: NextFunction) {
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

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  let ip = '';
  for (const iface in interfaces) {
    interfaces[iface]?.forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        ip = details.address;
      }
    });
  }
  return ip;
};


loadEnv();

const env = process.env.NODE_ENV ?? 'development';
const port = process.env.PORT ?? 20001;

const app = express();
const upload = multer(); // 不设置dest，文件会只保存在内存中 { dest: '' }

if (env === 'development') {
  app.use(CORS);
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

const authController = provider.get<AuthController>(injectType.AuthController);
const tagExplanationController = provider.get<TagExplanationController>(injectType.TagExplanationController);
const openInVscodeController = provider.get<OpenInVscodeController>(injectType.OpenInVscodeController);
const topCategoryController = provider.get<TopCategoryController>(injectType.TopCategoryController);
const secondCategoryController = provider.get<SecondCategoryController>(injectType.SecondCategoryController);
const tagController = provider.get<TagController>(injectType.TagController);

app.use('/', express.static(config.clientDir)); // 挂载网页文件
app.use('/tag', authMiddleware, express.static(config.tagExplanationDir)); // 挂载其他文件
// 当访问tag文件夹时，如果文件不存在，则创建一个文件
// 注意 config.tagExplanationDir 下其他文件也会到达这个路由。 比如 /assets/x/images/1.png
app.use('/tag/:filename', authMiddleware, tagExplanationController.notExistHandler.bind(tagExplanationController));


// ANCHOR Auth
app.post('/api/login', authController.login);


// ANCHOR TopCategory
app.get('/api/top-category/all', authMiddleware, topCategoryController.queryAllOfSorted.bind(topCategoryController));
app.post('/api/top-category', authMiddleware, topCategoryController.create.bind(topCategoryController));
app.put('/api/top-category', authMiddleware, topCategoryController.update.bind(topCategoryController));
app.delete('/api/top-category/:id', authMiddleware, topCategoryController.delete.bind(topCategoryController));
app.put('/api/top-category/order', authMiddleware, topCategoryController.updateOrder.bind(topCategoryController));


// ANCHOR SecondCategory
app.get('/api/second-category/all/:topCategoryId', authMiddleware, secondCategoryController.queryAllOfSorted.bind(secondCategoryController));
app.post('/api/second-category', authMiddleware, secondCategoryController.create.bind(secondCategoryController));
app.put('/api/second-category', authMiddleware, secondCategoryController.update.bind(secondCategoryController));
app.delete('/api/second-category/:id', authMiddleware, secondCategoryController.delete.bind(secondCategoryController));
app.put('/api/second-category/order', authMiddleware, secondCategoryController.updateOrder.bind(secondCategoryController));


// ANCHOR Client
app.get('/api/client/title', authMiddleware, (req: Request, res: Response) => {
  const c = provider.get<ClientService>(injectType.ClientService).getClientConfig();
  res.send(ResponseResult.success(c.title));
});


// ANCHOR Open In VSCode
app.get('/api/open-data-folder-in-vscode', authMiddleware, openInVscodeController.dataFolder.bind(openInVscodeController));
app.get('/api/open-tag-explanation-file-in-vscode', authMiddleware, openInVscodeController.tagExplanationFile.bind(openInVscodeController));


// ANCHOR Tag
app.get('/api/tag/all/:topCategoryId', authMiddleware, tagController.querySecondCategoryWithTagsByTopCategory.bind(tagController));
app.post('/api/tag', authMiddleware, upload.single('icon'), tagController.create.bind(tagController));
app.put('/api/tag', authMiddleware, upload.single('icon'), tagController.update.bind(tagController));
app.get('/api/tag/search', authMiddleware, tagController.search.bind(tagController));
app.delete('/api/tag/:id', authMiddleware, tagController.delete.bind(tagController));
app.put('/api/tag/order', authMiddleware, tagController.updateOrder.bind(tagController));


app.listen(port, () => {
  console.log(`
    Local:    http://localhost:${port}/
    Network:  http://${getLocalIp()}:${port}/
  `);
});