import express, { Request, Response } from 'express';
import multer from 'multer';
import node_path from 'node:path';
import node_fs from 'node:fs';
import config from './config';
import Result from './dto/result';
import provider from './provider/provider';
import injectType from './provider/injectType';
import sharp from 'sharp';
import type TopCategoryService from './service/TopCategoryService';
import type SecondCategoryService from './service/SecondCategoryService';
import type TagService from './service/TagService';
import type TagExplanationService from './service/TagExplanationService';
import type ClientService from './service/ClientService';


const port = 5000;
const app = express();
const upload = multer(); // 不设置dest，只保存在内存中 { dest: '' }

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 把编译后的client文件挂载到express服务器的 '/' 路径下
app.use('/', express.static(config.clientDir));
app.use('/tag', express.static(config.tagExplanationDir));


// 如果文件不存在，就创建一个文件
app.get('/tag/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;

    if (!filename) {
        res.send('filename is required');
        return;
    }

    const filenameRegex = /^[0-9]+\.md$/
    if (!filenameRegex.test(filename)) {
        res.send('filename is invalid');
        return;
    }

    const tagId = Number(filename.split('.')[0]);
    const tag = provider.get<TagService>(injectType.TagService).queryTagById(tagId);

    if (!tag) {
        res.send('tag not found');
        return;
    }

    // 在本地创建一个filename的文件，然后返回给客户端
    provider.get<TagExplanationService>(injectType.TagExplanationService).writeTagExplanationFrame(tag);
    res.redirect(`/tag/${filename}`);
})

app.get('/api/client/title', (req: Request, res: Response) => {
    const c = provider.get<ClientService>(injectType.ClientService).getClientConfig()
    res.send(Result.success(c.title))
})

app.get('/api/tag-explanation/vscode-open-url', (req: Request, res: Response) => {
    if (req.query.tagId) {
        res.redirect(`vscode://file/${node_path.join(config.tagExplanationDir, `${req.query.tagId}.md`)}`)
        return;
    }

    const referer: string | undefined = req.headers.referer;

    if (!referer) {
        res.send(Result.fail(1, 'referer is required'));
        return;
    }

    res.redirect(`vscode://file/${node_path.join(config.tagExplanationDir, node_path.basename(referer))}`)
})


// ANCHOR TopCategory

app.get('/api/top-category/all', (req: Request, res: Response) => {
    const data = provider.get<TopCategoryService>(injectType.TopCategoryService).queryAll();
    res.send(Result.success(data));
});

app.post('/api/top-category', (req: Request, res: Response) => {
    try {
        const data = provider.get<TopCategoryService>(injectType.TopCategoryService).create(req.body.name);
        res.send(Result.success(data));
    } catch (e: any) {
        res.send(Result.fail(1, e.message));
    }
});

app.put('/api/top-category', (req: Request, res: Response) => {
    const editRes = provider.get<TopCategoryService>(injectType.TopCategoryService).edit(req.body);
    if (editRes) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '修改失败'));
    }
});

app.delete('/api/top-category/:id', (req: Request, res: Response) => {
    if (provider.get<TopCategoryService>(injectType.TopCategoryService).delete(Number(req.params.id))) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '删除失败'));
    }
});

app.put('/api/top-category/order', (req: Request, res: Response) => {
    if (provider.get<TopCategoryService>(injectType.TopCategoryService).changeOrder(req.body.curId, req.body.tarNextId)) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '修改失败'));
    }
});

// ANCHOR SecondCategory
app.get('/api/second-category/all/:topCategoryId', (req: Request, res: Response) => {
    const data = provider.get<SecondCategoryService>(injectType.SecondCategoryService).queryAllByTopCategoryId(Number(req.params.topCategoryId));
    res.send(Result.success(data));
});

app.post('/api/second-category', (req: Request, res: Response) => {
    try {
        const data = provider.get<SecondCategoryService>(injectType.SecondCategoryService).create(req.body);
        res.send(Result.success(data));
    } catch (e: any) {
        res.send(Result.fail(1, e.message));
    }
});

app.put('/api/second-category', (req: Request, res: Response) => {
    const editRes = provider.get<SecondCategoryService>(injectType.SecondCategoryService).edit(req.body);
    if (editRes) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '修改失败'));
    }
});

app.delete('/api/second-category/:id', (req: Request, res: Response) => {
    const deleteRes = provider.get<SecondCategoryService>(injectType.SecondCategoryService).delete(Number(req.params.id));

    if (deleteRes) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '删除失败'));
    }
});

app.put('/api/second-category/order', (req: Request, res: Response) => {
    const secondCategoryService = provider.get<SecondCategoryService>(injectType.SecondCategoryService)
    const { curId, tarNextId, moveToTopCategoryId } = req.body as DTO.SecondCategoryOrderForm;

    if (secondCategoryService.changeOrderAndMove(curId, tarNextId, moveToTopCategoryId)) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '修改失败'));
    }
})

// ANCHOR Tag

app.get('/api/tag/all/:topCategoryId', (req: Request, res: Response) => {
    const data = provider.get<TagService>(injectType.TagService).querySecondCategoryWithTagsByTopCategoryId(Number(req.params.topCategoryId));
    res.send(Result.success(data));
});

// 处理单个文件上传的请求signle('icon')，上传的文件会保存在req.file中
app.post('/api/tag', upload.single('icon'), async (req: Request, res: Response) => {
    try {
        const tag = provider.get<TagService>(injectType.TagService).create(req.body)
        await saveTagIcon(tag.id, req.file)
        // 创建tag的md文件
        provider.get<TagExplanationService>(injectType.TagExplanationService).writeTagExplanationFrame(tag);

        res.send(Result.success(tag));
    } catch (e: any) {
        res.send(Result.fail(1, e.message));
    }
});

app.put('/api/tag', upload.single('icon'), async (req: Request, res: Response) => {
    if (provider.get<TagService>(injectType.TagService).edit(req.body)) {
        await saveTagIcon(req.body.id, req.file)
        provider.get<TagExplanationService>(injectType.TagExplanationService).updateTagExplanation(req.body);
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '修改失败'));
    }
});

const saveTagIcon = function (id: number, file: Express.Multer.File | undefined) {
    if (!file) return;

    const tagImagesDir = config.getTagExplanationImagesDir(id);
    node_fs.mkdirSync(tagImagesDir, { recursive: true });

    const maxWidth = 1920;
    const maxHeight = 1080;

    return new Promise<void>((resolve, reject) => {
        sharp(file.buffer)
            .resize(maxWidth, maxHeight, {
                fit: 'outside',
                withoutEnlargement: true, // 尺寸不够时不放大
            })
            .toFormat('jpg', { quality: 100 })
            .toFile(node_path.join(tagImagesDir, 'icon.jpg')).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            })
    })
}

app.delete('/api/tag/:id', (req: Request, res: Response) => {
    if (provider.get<TagService>(injectType.TagService).delete(Number(req.params.id))) {
        res.send(Result.success());
        // 把文件名改成`${id}_deleted.md`
        node_fs.rename(node_path.join(config.tagExplanationDir, `${req.params.id}.md`), node_path.join(config.tagExplanationDir, `${req.params.id}_deleted.md`), (err) => {
            if (err) {
                console.error('Error renaming file:', err);
            }
        });
    } else {
        res.send(Result.fail(1, '删除失败'));
    }
});

app.put('/api/tag/order', (req: Request, res: Response) => {
    const tagService = provider.get<TagService>(injectType.TagService)
    const { curId, tarNextId, moveToSecondCategoryId } = req.body as DTO.TagOrderForm;

    if (tagService.changeOrderAndMove(curId, tarNextId, moveToSecondCategoryId)) {
        res.send(Result.success());
    } else {
        res.send(Result.fail(1, '修改失败'));
    }
})