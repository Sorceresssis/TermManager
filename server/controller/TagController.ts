import nodeFs from 'node:fs';
import nodePath from 'node:path';

import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import sharp from 'sharp';

import ResourcePath from '@/config/resource-path';
import { ensureFilePath } from '@/helper/fs.helper';
import { ResponseResult } from '@/pojo/response-result';
import injectType from '@/provider/inject-type';
import TagExplanationService from '@/service/TagExplanationService';
import TagService from '@/service/TagService';

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

      await Promise.all([
        saveTagIcon(tag.id, req.file),
        this.tagExplanationService.writeTagExplanationIndexFrame(tag),
      ]).catch(err => {
        res.send(ResponseResult.success(tag, String(err)));
        return;
      });

      res.send(ResponseResult.success(tag));
    } catch (err) {
      res.send(ResponseResult.error(String(err)));
    }
  }

  public async update(req: Request, res: Response) {
    const body = req.body as VO.Tag;

    const tag :VO.Tag = {
      id: body.id,
      name: body.name,
      name_zh: body.name_zh,
      name_ja: body.name_ja,
      name_en: body.name_en,
    };

    if (this.tagService.edit(tag)) {
      await Promise.all([
        saveTagIcon(tag.id, req.file),
        this.tagExplanationService.updateTagExplanationIndex(tag),
      ]).catch(err => {
        res.send(ResponseResult.success(void 0, String(err)));
        return;
      });

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
    const tagId = Number(req.params.id);
    if (this.tagService.delete(tagId)) {
      res.send(ResponseResult.success());

      const targetPath = nodePath.join(ResourcePath.getTagExplanationItemDir(tagId));
      const renamePath = nodePath.join(ResourcePath.getTagExplanationItemDeletedDir(tagId));
      nodeFs.rename(targetPath, renamePath, err => {
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


async function saveTagIcon(id: number, file: Express.Multer.File | undefined) {
  if (!file) return;

  const tagIconPath = await ensureFilePath(ResourcePath.getTagExplanationItemIconFile(id));

  const maxWidth = 1920;
  const maxHeight = 1080;

  await sharp(file.buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'outside',
      withoutEnlargement: true, // 尺寸不够时不放大
    })
    .toFormat('jpg', {
      quality: 100,
    })
    .toFile(tagIconPath);
};
