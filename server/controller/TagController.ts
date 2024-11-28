import nodeFs from 'node:fs';
import nodePath from 'node:path';

import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import sharp from 'sharp';

import config from '../config';
import { ResponseResult } from '../dto/ResponseResults';
import injectType from '../provider/injectType';
import TagExplanationService from '../service/TagExplanationService';
import TagService from '../service/TagService';

@injectable()
export class TagController {
  constructor(
    @inject(injectType.TagService) private tagService: TagService,
    @inject(injectType.TagExplanationService) private tagExplanationService: TagExplanationService
  ) { }

  public querySecondCategoryWithTagsByTopCategory(req: Request, res: Response) {
    const data = this.tagService.querySecondCategoryWithTagsByTopCategoryId(Number(req.params.topCategoryId));
    res.send(ResponseResult.success(data));
  }

  public async create(req: Request, res: Response) {
    try {
      const tag = this.tagService.create(req.body);
      await saveTagIcon(tag.id, req.file);
      // 创建tag的md文件
      this.tagExplanationService.writeTagExplanationFrame(tag);

      res.send(ResponseResult.success(tag));
    } catch (err) {
      res.send(ResponseResult.error(String(err)));
    }
  }

  public async update(req: Request, res: Response) {
    if (this.tagService.edit(req.body)) {
      await saveTagIcon(req.body.id, req.file);
      this.tagExplanationService.updateTagExplanation(req.body);
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('修改失败'));
    }
  }

  public search(req: Request, res: Response) {
    const keyword = req.query.keyword as string;
    const tags = this.tagService.queryTagByKeyword(keyword);
    res.send(ResponseResult.success(tags));
  }

  public delete(req: Request, res: Response) {
    if (this.tagService.delete(Number(req.params.id))) {
      res.send(ResponseResult.success());
      // 把文件名改成`${id}_deleted.md`
      nodeFs.rename(nodePath.join(config.tagExplanationDir, `${req.params.id}.md`), nodePath.join(config.tagExplanationDir, `${req.params.id}_deleted.md`), err => {
        if (err) {
          console.error('Error renaming file:', err);
        }
      });
    } else {
      res.send(ResponseResult.error('删除失败'));
    }
  }

  public updateOrder(req: Request, res: Response) {
    const { curId, tarNextId, moveToSecondCategoryId } = req.body as DTO.TagOrderForm;

    if (this.tagService.changeOrderAndMove(curId, tarNextId, moveToSecondCategoryId)) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('修改失败'));
    }
  }
}


function saveTagIcon(id: number, file: Express.Multer.File | undefined) {
  if (!file) return;

  const tagImagesDir = config.getTagExplanationImagesDir(id);
  nodeFs.mkdirSync(tagImagesDir, {
    recursive: true,
  });

  const maxWidth = 1920;
  const maxHeight = 1080;

  return new Promise<void>((resolve, reject) => {
    sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'outside',
        withoutEnlargement: true, // 尺寸不够时不放大
      })
      .toFormat('jpg', {
        quality: 100,
      })
      .toFile(nodePath.join(tagImagesDir, 'icon.jpg')).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
  });
};