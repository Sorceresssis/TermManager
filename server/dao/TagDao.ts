import { inject, injectable } from 'inversify';

import type TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';


@injectable()
class TagDao {
  public constructor(
    @inject(injectType.TagDB) private db: TagDB
  ) { }

  public queryTagInfoById(id: number) {
    const prepare = this.db.prepare<any, VO.Tag>('SELECT id, name, name_zh, name_ja, name_en FROM \'tag\' WHERE id = ?;');
    return prepare.get(id);
  }

  public queryAll() {
    const prepare = this.db.prepare<[], VO.Tag>('SELECT id, name, name_zh, name_ja, name_en FROM tag');
    return prepare.all();
  }

  public queryAllBySecondCategoryId(secondCategoryId: number): VO.Tag[] {
    const prepare = this.db.prepare(`
            WITH RECURSIVE 'tag_list' AS (
                SELECT id, name, name_zh, name_ja, name_en, prev_id, next_id FROM 'tag' WHERE second_category_id = ? AND prev_id = 0
                UNION ALL
                SELECT t.id, t.name, t.name_zh, t.name_ja, t.name_en, t.prev_id, t.next_id FROM 'tag' t JOIN 'tag_list' tl ON t.id = tl.next_id WHERE tl.next_id != 0
            )
            SELECT id, name, name_zh, name_ja, name_en FROM 'tag_list';
        `);
    return prepare.all(secondCategoryId) as VO.Tag[];
  }

  public queryByKeyword(keyword: string, pn: number, ps: number): VO.TagWithCategory[] {
    const stmt = this.db.prepare<any[], VO.TagWithCategory>(`
      SELECT
      	tc.id as topCategoryId,
      	tc.name as topCategoryName,
      	sc.id as secondCategoryId,
      	sc.name as secondCategoryName,
      	t.id,
      	t.name,
      	t.name_zh,
      	t.name_ja,
      	t.name_en
      FROM
      	top_category as tc
      	JOIN second_category as sc ON tc.id = sc.top_category_id
      	JOIN tag as t ON sc.id = t.second_category_id
      WHERE t.name LIKE ? OR t.name_zh LIKE ? OR t.name_en LIKE ? OR t.name_ja LIKE ?
      LIMIT ?, ?;
    `);

    const likeValue = `%${keyword}%`;
    return stmt.all(likeValue, likeValue, likeValue, likeValue, (pn - 1) * ps, ps);
  }

  public querySecondCategoryIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT second_category_id FROM \'tag\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryIdBySecondCategoryIdNextId(secondCategoryId: number, nextId: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT id FROM \'tag\' WHERE second_category_id = ? AND next_id = ?;');
    return prepare.pluck().get(secondCategoryId, nextId) as number | undefined;
  }

  public queryIdBySecondCategoryIdPrevId(secondCategoryId: number, prevId: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT id FROM \'tag\' WHERE second_category_id = ? AND prev_id = ?;');
    return prepare.pluck().get(secondCategoryId, prevId) as number | undefined;
  }

  public queryPrevIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT prev_id FROM \'tag\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryNextIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT next_id FROM \'tag\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryPrevIdNextIdById(id: PrimaryKey): [number, number] | undefined {
    const prepare = this.db.prepare('SELECT prev_id, next_id FROM \'tag\' WHERE id = ?;');
    return prepare.raw().get(id) as [number, number] | undefined;
  }

  public insertInfo(name: string, nameZh: string, nameJa: string, nameEn: string, secondCategoryId: number): PrimaryKey {
    const prepare = this.db.prepare('INSERT INTO \'tag\' (name, name_zh, name_ja, name_en, second_category_id) VALUES (?, ?, ?, ?, ?);');
    return prepare.run(name, nameZh, nameJa, nameEn, secondCategoryId).lastInsertRowid;
  }

  public updateInfoById(id: PrimaryKey, name: string, nameZh: string, nameJa: string, nameEn: string): number {
    const prepare = this.db.prepare('UPDATE \'tag\' SET name = ?, name_zh = ?, name_ja = ?, name_en = ? WHERE id = ?;');
    return prepare.run(name.trim(), nameZh.trim(), nameJa.trim(), nameEn.trim(), id).changes;
  }

  public updateSecondCategoryIdById(id: PrimaryKey, secondCategoryId: number): number {
    const prepare = this.db.prepare('UPDATE \'tag\' SET second_category_id = ? WHERE id = ?;');
    return prepare.run(secondCategoryId, id).changes;
  }

  public updatePrevIdById(id: PrimaryKey, prevId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'tag\' SET prev_id = ? WHERE id = ?;');
    return prepare.run(prevId, id).changes;
  }

  public updateNextIdById(id: PrimaryKey, nextId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'tag\' SET next_id = ? WHERE id = ?;');
    return prepare.run(nextId, id).changes;
  }

  public updatePrevIdNextIdById(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'tag\' SET prev_id = ?, next_id = ? WHERE id = ?;');
    return prepare.run(prevId, nextId, id).changes;
  }

  public deleteById(id: PrimaryKey): number {
    const prepare = this.db.prepare('DELETE FROM \'tag\' WHERE id = ?;');
    return prepare.run(id).changes;
  }

  public deleteAllBySecondCategoryId(secondCategoryId: number): number {
    const prepare = this.db.prepare('DELETE FROM \'tag\' WHERE second_category_id = ?;');
    return prepare.run(secondCategoryId).changes;
  }
}


export default TagDao;