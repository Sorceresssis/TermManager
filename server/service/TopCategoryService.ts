import { inject, injectable } from 'inversify';

import type TopCategoryDao from '@/dao/TopCategoryDao';
import type TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';
import provider from '@/provider/provider';


@injectable()
class TopCategoryService {
  public constructor(
    @inject(injectType.TopCategoryDao) private topCategoryDao: TopCategoryDao
  ) { }


  public queryAll(): VO.TopCategory[] {
    return this.topCategoryDao.queryAll();
  }

  public edit(topCategory: VO.TopCategory): boolean {
    topCategory.name = topCategory.name.trim();
    return this.topCategoryDao.updateInfoById(topCategory) === 1;
  }

  public create(name: string): VO.TopCategory {
    name = name.trim();
    let newCategoryId: PrimaryKey = 0;

    provider.get<TagDB>(injectType.TagDB).transaction(() => {
      // 获取第一位的id
      const tailId = this.topCategoryDao.queryIdByNextId(0);
      // 插入新节点
      newCategoryId = this.topCategoryDao.insert({
        id: 0, name,
      });

      // 把新节点插入到链表的尾部
      if (tailId !== void 0) {
        this.insertNode(newCategoryId, tailId, 0);
      }
    })();

    return {
      id: newCategoryId, name: name,
    };
  }

  public delete(id: number): boolean {
    let deleteRes: boolean = false;

    provider.get<TagDB>(injectType.TagDB).transaction(() => {
      this.removeNode(id);
      deleteRes = this.topCategoryDao.deleteById(id) === 1;

      // TODO 删除所有子节点
    })();

    return deleteRes;
  }

  public changeOrder(curId: number, tarNextId: number): boolean {
    const curNextId = this.topCategoryDao.queryNextIdById(curId);

    // 如果curNextId 不存在或者curNextId === tarNextId,则不需要移动
    if (curNextId === void 0 || curNextId === tarNextId) return false;

    provider.get<TagDB>(injectType.TagDB).transaction(() => {
      this.removeNode(curId);
      // tarNextId === 0 ,表示要移动到链表的尾部
      const tarPrevId = this.topCategoryDao.queryIdByNextId(tarNextId) || 0;
      this.insertNode(curId, tarPrevId, tarNextId);
    })();

    return true;
  }

  private insertNode(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): void {
    // 1. 修改新节点的前驱节点为prevId, 后继节点nextId
    this.topCategoryDao.updatePrevIdNextIdById(id, prevId, nextId);
    // 2. 把新节点的前驱节点的nextId 指向新节点
    this.topCategoryDao.updateNextIdById(prevId, id);
    // 3. 把新节点的后继节点的prevId 指向新节点
    this.topCategoryDao.updatePrevIdById(nextId, id);
  }

  private removeNode(id: PrimaryKey): void {
    // 1. 获取被删除节点的前驱节点和后继节点
    const [prevId, nextId] = this.topCategoryDao.queryPrevIdNextIdById(id) || [0, 0];
    // 2. 当prevId不为0修改前驱节点的nextId 为后继节点的id
    if (prevId) { this.topCategoryDao.updateNextIdById(prevId, nextId); }
    // 3. 当nextId不为0修改后继节点的prevId 为前驱节点的id
    if (nextId) { this.topCategoryDao.updatePrevIdById(nextId, prevId); }
  }
}


export default TopCategoryService;