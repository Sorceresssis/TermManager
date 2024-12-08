import { inject, injectable } from 'inversify';

import type TagDao from '@/dao/TagDao';
import type TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';
import provider from '@/provider/provider';
import type SecondCategoryService from '@/service/SecondCategoryService';


@injectable()
class TagService {
  public constructor(
    @inject(injectType.TagDB) private tagDB: TagDB,
    @inject(injectType.TagDao) private tagDao: TagDao
  ) { }

  public queryTagById(id: number) {
    return this.tagDao.queryTagInfoById(id);
  }

  public querySecondCategoryWithTagsByTopCategoryId(topCategoryId: number): VO.SecondCategoryWithTags[] {
    // 获取二级分类
    const secondCategories = provider.get<SecondCategoryService>(injectType.SecondCategoryService).queryAllByTopCategoryId(topCategoryId);

    return secondCategories.map((secondCategory: any) => {
      secondCategory.tags = this.tagDao.queryAllBySecondCategoryId(secondCategory.id);
      return secondCategory;
    });
  }

  public queryTagByKeyword(keyword: string, pn: number = 1, ps: number = 30): VO.Tag[] {
    return this.tagDao.queryByKeyword(keyword, pn, ps);
  }

  public create(data: DTO.TagForm): VO.Tag {
    data.name = data.name.trim();
    data.name_zh = data.name_zh.trim();
    data.name_ja = data.name_ja.trim();
    data.name_en = data.name_en.trim();

    let newId: PrimaryKey = 0;

    this.tagDB.transaction(() => {
      const tailId = this.tagDao.queryIdBySecondCategoryIdNextId(data.secondCategoryId, 0);

      newId = this.tagDao.insertInfo(data.name, data.name_zh, data.name_ja, data.name_en, data.secondCategoryId);

      if (tailId !== void 0) {
        this.insertNode(newId, tailId, 0);
      }
    })();

    return {
      id: newId, name: data.name, name_zh: data.name_zh, name_ja: data.name_ja, name_en: data.name_en,
    };
  }

  public edit(tag: VO.Tag): boolean {
    return this.tagDao.updateInfoById(tag.id, tag.name, tag.name_zh, tag.name_ja, tag.name_en) === 1;
  }

  public changeOrderAndMove(curId: number, tarNextId: number, moveToSecondCategoryId: number): boolean {
    let res: boolean = true;

    this.tagDB.transaction(() => {
      const curSecondCategoryId = this.tagDao.querySecondCategoryIdById(curId);
      const tarSecondCategoryId = tarNextId === 0 ? moveToSecondCategoryId : this.tagDao.querySecondCategoryIdById(tarNextId);
      if (curSecondCategoryId === void 0 || tarSecondCategoryId === void 0) {
        res = false;
        return;
      }

      const curNextId = this.tagDao.queryNextIdById(curId);
      if (curNextId === void 0) {
        res = false;
        return;
      }
      if (curNextId === tarNextId && curSecondCategoryId === tarSecondCategoryId) { return false; }

      this.removeNode(curId);
      const tarPrevId = this.tagDao.queryIdBySecondCategoryIdNextId(tarSecondCategoryId, tarNextId) || 0;
      this.insertNode(curId, tarPrevId, tarNextId);

      if (curSecondCategoryId !== tarSecondCategoryId) {
        this.tagDao.updateSecondCategoryIdById(curId, tarSecondCategoryId);
      }
    })();

    return res;
  }

  public delete(id: number): boolean {
    let deleteRes: boolean = false;

    this.tagDB.transaction(() => {
      this.removeNode(id);
      deleteRes = this.tagDao.deleteById(id) === 1;
    })();

    return deleteRes;
  }

  private insertNode(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey) {
    this.tagDao.updatePrevIdNextIdById(id, prevId, nextId);
    this.tagDao.updateNextIdById(prevId, id);
    this.tagDao.updatePrevIdById(nextId, id);
  }

  private removeNode(id: PrimaryKey) {
    const [prevId, nextId] = this.tagDao.queryPrevIdNextIdById(id) || [0, 0];
    if (prevId) { this.tagDao.updateNextIdById(prevId, nextId); }
    if (nextId) { this.tagDao.updatePrevIdById(nextId, prevId); }
  }
}


export default TagService;