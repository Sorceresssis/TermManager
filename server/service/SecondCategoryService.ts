import { inject, injectable } from 'inversify';

import type SecondCategoryDao from '@/dao/SecondCategoryDao';
import type TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';
import provider from '@/provider/provider';


@injectable()
class SecondCategoryService {
  public constructor(
    @inject(injectType.SecondCategoryDao) private secondCategoryDao: SecondCategoryDao
  ) { }

  public queryAllByTopCategoryId(topCategoryId: number): VO.SecondCategory[] {
    return this.secondCategoryDao.queryAllOfTopCategory(topCategoryId);
  }

  public create(data: DTO.SecondCategoryForm): VO.SecondCategory {
    data.name = data.name.trim();
    let newId: PrimaryKey = 0;

    provider.get<TagDB>(injectType.TagDB).transaction(() => {
      const tailId = this.secondCategoryDao.queryIdByTopCategoryIdNextId(data.topCategoryId, 0);

      newId = this.secondCategoryDao.insert(data.name, data.topCategoryId);

      if (tailId !== void 0) {
        this.insertNode(newId, tailId, 0);
      }
    })();

    return {
      id: newId, name: data.name,
    };
  }

  public edit(secondCategory: VO.SecondCategory): boolean {
    secondCategory.name = secondCategory.name.trim();

    return this.secondCategoryDao.updateInfoById(secondCategory.id, secondCategory.name) === 1;
  }

  public changeOrderAndMove(curId: number, tarNextId: number, moveToTopCategoryId: number): boolean {
    let res: boolean = true;

    provider.get<TagDB>(injectType.TagDB).transaction(() => {
      const curTopCategoryId = this.secondCategoryDao.queryTopCategoryIdById(curId);
      const tarTopCategoryId = tarNextId === 0 ? moveToTopCategoryId : this.secondCategoryDao.queryTopCategoryIdById(tarNextId);
      if (curTopCategoryId === void 0 || tarTopCategoryId === void 0) {
        res = false;
        return;
      }

      const curNextId = this.secondCategoryDao.queryNextIdById(curId);
      // 要操作的节点不存在
      if (curNextId === void 0) {
        res = false;
        return;
      }
      // 自己移动到自己原本的位置，要过滤掉，
      if (curNextId === tarNextId && curTopCategoryId === tarTopCategoryId) { return false; }

      this.removeNode(curId);
      // 一定是先把要移动的节点链接删除然后再去查询tarPrevId，因为可能要移动到原来的位置。这样会导致要移动的nextId指向自己
      const tarPrevId = this.secondCategoryDao.queryIdByTopCategoryIdNextId(tarTopCategoryId, tarNextId) || 0;
      this.insertNode(curId, tarPrevId, tarNextId);

      // 一点要在后面修改TopCategoryId， 因为前面有一个查询tarPrevId的操作
      if (curTopCategoryId !== tarTopCategoryId) {
        this.secondCategoryDao.updateTopCategoryIdById(curId, tarTopCategoryId);
      }
    })();

    return res;
  }

  public delete(id: number): boolean {
    let deleteRes: boolean = false;

    provider.get<TagDB>(injectType.TagDB).transaction(() => {
      this.removeNode(id);
      deleteRes = this.secondCategoryDao.deleteById(id) === 1;

      // TODO 二级分类下的标签先不删除，留在那里。
    })();

    return deleteRes;
  }

  private insertNode(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey) {
    this.secondCategoryDao.updatePrevIdNextIdById(id, prevId, nextId);
    this.secondCategoryDao.updateNextIdById(prevId, id);
    this.secondCategoryDao.updatePrevIdById(nextId, id);
  }

  private removeNode(id: PrimaryKey) {
    const [prevId, nextId] = this.secondCategoryDao.queryPrevIdNextIdById(id) || [0, 0];
    if (prevId) { this.secondCategoryDao.updateNextIdById(prevId, nextId); }
    if (nextId) { this.secondCategoryDao.updatePrevIdById(nextId, prevId); }
  }
}


export default SecondCategoryService;