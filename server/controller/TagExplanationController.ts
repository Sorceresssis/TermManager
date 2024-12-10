import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import ResourcePath from '@/config/resource-path';
import { isDigitString } from '@/helper/common.helper';

import { ResponseResult } from '../pojo/response-result';
import injectType from '../provider/inject-type';
import type TagExplanationService from '../service/TagExplanationService';
import type TagService from '../service/TagService';

@injectable()
export class TagExplanationController {
  constructor(
    @inject(injectType.TagService) private tagService: TagService,
    @inject(injectType.TagExplanationService) private tagExplanationService: TagExplanationService
  ) { }


  public async HandleItemIndexMiss(req: Request<API.HandleitemIndexMissParamsP>, res: Response) {
    const tagId = Number.parseInt(req.params.id, 10);

    const tag = this.tagService.queryTagById(tagId);
    if (!tag) {
      res.send(ResponseResult.error('tag not found'));
      return;
    }

    await this.tagExplanationService.writeTagExplanationIndexFrame(tag);
    res.redirect(req.originalUrl);
  };

  public async createReference(req: Request<void, void, {tagId:number}>, res: Response) {
    const refInfo = await this.tagExplanationService.createTagExplanationRef(req.body.tagId);
    res.send(ResponseResult.success(refInfo));
  }

  public async format(req: Request<void, void, void, API.FormatTagExplanationFileParamsQ>, res: Response) {
    const tagIdStr = req.query.id;
    if (tagIdStr && !isDigitString(tagIdStr)) {
      res.send(ResponseResult.error('id is required, and must be a number'));
      return;
    }
    const tagId = Number(tagIdStr);

    const refIndexStr = req.query.ref;
    if (refIndexStr && isDigitString(refIndexStr)) {
      const refIndex = Number(refIndexStr);
      await this.tagExplanationService.formatTagExplanation(tagId, refIndex);
      res.redirect(`/tag/${tagId}/ref_${refIndex}.md`);
      return;
    }

    await this.tagExplanationService.formatTagExplanation(tagId);
    res.redirect(`/tag/${tagId}/index.md`);
  }

  public openDataFolderInEditor(req: Request, res: Response) {
    res.redirect(`vscode://file/${ResourcePath.DATA_DIR}`);
  }

  public openInEditor(req: Request<void, void, void, API.OpenTagExplanationFileEditParamsQ>, res: Response) {
    const tagIdStr = req.query.id;
    if (tagIdStr && !isDigitString(tagIdStr)) {
      res.send(ResponseResult.error('id is required, and must be a number'));
      return;
    }
    const tagId = Number(tagIdStr);

    const refIndexStr = req.query.ref;
    if (refIndexStr && isDigitString(refIndexStr)) {
      const refIndex = Number(refIndexStr);
      res.redirect(`vscode://file/${ResourcePath.getTagExplanationItemRefFile(tagId, refIndex)}`);
      return;
    }

    res.redirect(`vscode://file/${ResourcePath.getTagExplanationItemIndexFile(tagId)}`);
  }
}
