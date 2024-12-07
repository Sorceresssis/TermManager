
import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ResponseResult } from '@/pojo/response-result';
import injectType from '@/provider/inject-type';
import type TopCategoryService from '@/service/TopCategoryService';

@injectable()
export class TopCategoryController {
  constructor(
    @inject(injectType.TopCategoryService) private topCategoryService: TopCategoryService
  ) { }

  public queryAllOfSorted(req: Request, res: Response) {
    try {
      const topCategorys = this.topCategoryService.queryAll();
      res.send(ResponseResult.success(topCategorys));
    } catch (err) {
      res.send(ResponseResult.error(String(err)));
    }
  }

  public create(req: Request, res: Response) {
    try {
      const topCategory = this.topCategoryService.create(req.body.name);
      res.send(ResponseResult.success(topCategory));
    } catch (err) {
      res.send(ResponseResult.error(String(err)));
    }
  }

  public update(req: Request, res: Response) {
    const editRes = this.topCategoryService.edit(req.body);
    if (editRes) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('修改失败'));
    }
  }

  public delete(req: Request, res: Response) {
    if (this.topCategoryService.delete(Number(req.params.id))) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('删除失败'));
    }
  }

  public updateOrder(req: Request, res: Response) {
    const {curId, tarNextId} = req.body;
    if (curId === undefined || tarNextId === undefined) {
      res.send(ResponseResult.error('参数错误'));
      return;
    }

    const updateRes = this.topCategoryService.changeOrder(curId, tarNextId);
    if (updateRes) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('修改失败'));
    }
  }
}
