import cookieParser from 'cookie-parser';
import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';

import ResourcePath from '@/config/resource-path';
import settings from '@/config/settings';
import type { AuthController } from '@/controller/AuthController';
import type { SecondCategoryController } from '@/controller/SecondCategoryController';
import type { TagController } from '@/controller/TagController';
import type { TagExplanationController } from '@/controller/TagExplanationController';
import type { TopCategoryController } from '@/controller/TopCategoryController';
import { getAllLocalIps } from '@/helper/net.helper';
import { authMiddleware } from '@/middleware/AuthMiddleware';
import { cors } from '@/middleware/cors';
import { ResponseResult } from '@/pojo/response-result';
import injectType from '@/provider/inject-type';
import provider from '@/provider/provider';
import type ClientService from '@/service/ClientService';


const app = express();
const upload = multer(); // 不设置 dest, 不持久到磁盘

if (settings.NODE_ENV === 'development') {
  app.use(cors);
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

const authController = provider.get<AuthController>(injectType.AuthController);
const tagExplanationController = provider.get<TagExplanationController>(injectType.TagExplanationController);
const topCategoryController = provider.get<TopCategoryController>(injectType.TopCategoryController);
const secondCategoryController = provider.get<SecondCategoryController>(injectType.SecondCategoryController);
const tagController = provider.get<TagController>(injectType.TagController);
const clientService = provider.get<ClientService>(injectType.ClientService);

/**
 * 挂载前端网页文件
 */
app.use('/', express.static(ResourcePath.CLIENT_DIR));


/**
 * 将 tag-explanations 文件夹挂载到 /tag 路径下
 */
app.use('/tag', authMiddleware, express.static(ResourcePath.TAG_EXPLANATIONS_DIR));


/**
 * 如果的资源在 ResourcePath.TAG_EXPLANATIONS_DIR 目录下不存在，请求就会到达此接口。
 * 如果应该存在就自动创建。
 */
app.use('/tag/:id/index.md', authMiddleware, tagExplanationController.HandleItemIndexMiss.bind(tagExplanationController));
app.use('/api/tag-explanation/ref', authMiddleware, tagExplanationController.createReference.bind(tagExplanationController));
app.use('/api/tag-explanation/format', authMiddleware, tagExplanationController.format.bind(tagExplanationController));
app.use('/api/tag-explanation/open-in-editor', authMiddleware, tagExplanationController.openInEditor.bind(tagExplanationController));
app.use('/api/tag-explanation/open-data-folder-in-editor', authMiddleware, tagExplanationController.openDataFolderInEditor.bind(tagExplanationController));


/**
 * 登录接口
 */
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
app.get('/api/client/config', authMiddleware, (req: Request, res: Response) => {
  res.send(ResponseResult.success(clientService.getClientConfig()));
});


// ANCHOR Tag
app.get('/api/tag/all/:topCategoryId', authMiddleware, tagController.querySecondCategoryWithTagsByTopCategory.bind(tagController));
app.post('/api/tag', authMiddleware, upload.single('icon'), tagController.create.bind(tagController));
app.put('/api/tag', authMiddleware, upload.single('icon'), tagController.update.bind(tagController));
app.get('/api/tag/search', authMiddleware, tagController.search.bind(tagController));
app.delete('/api/tag/:id', authMiddleware, tagController.delete.bind(tagController));
app.put('/api/tag/order', authMiddleware, tagController.updateOrder.bind(tagController));


app.listen(settings.SERVER_PORT, () => {
  const netWorkIps = getAllLocalIps().map(ip => {
    return `Network(${ip.interface}):  http://${ip.address}:${settings.SERVER_PORT}/`;
  }).join('\n');

  console.log(`Local:  http://localhost:${settings.SERVER_PORT}/\n${netWorkIps}`);
});
