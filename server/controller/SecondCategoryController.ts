import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ResponseResult } from '@/pojo/response-result';
import injectType from '@/provider/inject-type';
import SecondCategoryService from '@/service/SecondCategoryService';


@injectable()
export class SecondCategoryController {
  constructor(
    @inject(injectType.SecondCategoryService) private secondCategoryService : SecondCategoryService
  ) { }

  public queryAllOfSorted(req: Request, res: Response) {
    const data = this.secondCategoryService.queryAllByTopCategoryId(Number(req.params.topCategoryId));
    res.send(ResponseResult.success(data));
  }

  public create(req: Request, res: Response) {
    try {
      const data = this.secondCategoryService.create(req.body);
      res.send(ResponseResult.success(data));
    } catch (err) {
      res.send(ResponseResult.error(String(err)));
    }
  }

  public update(req: Request, res: Response) {
    const editRes = this.secondCategoryService.edit(req.body);
    if (editRes) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('修改失败'));
    }
  }

  public delete(req: Request, res: Response) {
    const deleteRes = this.secondCategoryService.delete(Number(req.params.id));

    if (deleteRes) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('删除失败'));
    }
  }

  public updateOrder(req: Request, res: Response) {
    const { curId, tarNextId, moveToTopCategoryId } = req.body as DTO.SecondCategoryOrderForm;
    const updateRes = this.secondCategoryService.changeOrderAndMove(curId, tarNextId, moveToTopCategoryId);

    if (updateRes) {
      res.send(ResponseResult.success());
    } else {
      res.send(ResponseResult.error('修改失败'));
    }
  }
}
