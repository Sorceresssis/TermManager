import { inject, injectable } from 'inversify';

import type TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';


@injectable()
class SecondCategoryDao {
  public constructor(
        @inject(injectType.TagDB) private db: TagDB
  ) { }


  public queryAllOfTopCategory(topCategoryId: number): VO.SecondCategory[] {
    // union all 下面的 'select' 的 's.top_category_id = ?' 可以不用写，因为上面的 'select' 已经限定了
    const prepare = this.db.prepare(`
            WITH RECURSIVE 'second_category_list' AS (
                SELECT id, name, prev_id, next_id FROM 'second_category' WHERE top_category_id = ? AND prev_id = 0
                UNION ALL
                SELECT s.id, s.name, s.prev_id, s.next_id FROM 'second_category' s JOIN 'second_category_list' sl ON s.id = sl.next_id WHERE sl.next_id != 0
            )
            SELECT id, name FROM 'second_category_list';
        `);

    return prepare.all(topCategoryId) as VO.SecondCategory[];
  }

  public queryTopCategoryIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT top_category_id FROM \'second_category\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryIdByTopCategoryIdNextId(topCategoryId: number, nextId: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT id FROM \'second_category\' WHERE top_category_id = ? AND next_id = ?;');
    return prepare.pluck().get(topCategoryId, nextId) as number | undefined;
  }

  public queryIdByTopCategoryIdPrevId(topCategoryId: number, prevId: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT id FROM \'second_category\' WHERE top_category_id = ? AND prev_id = ?;');
    return prepare.pluck().get(topCategoryId, prevId) as number | undefined;
  }

  public queryPrevIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT prev_id FROM \'second_category\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryNextIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT next_id FROM \'second_category\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryPrevIdNextIdById(id: PrimaryKey): [number, number] | undefined {
    const prepare = this.db.prepare('SELECT prev_id, next_id FROM \'second_category\' WHERE id = ?;');
    return prepare.raw().get(id) as [number, number] | undefined;
  }

  public insert(name: string, topCategoryId: number): PrimaryKey {
    const prepare = this.db.prepare('INSERT INTO \'second_category\' (name, top_category_id) VALUES (?, ?);');
    return prepare.run(name, topCategoryId).lastInsertRowid;
  }

  public updateInfoById(id: number, name: string): number {
    const prepare = this.db.prepare('UPDATE \'second_category\' SET name = ?, gmt_update = CURRENT_TIMESTAMP WHERE id = ?;');
    return prepare.run(name, id).changes;
  }

  public updateTopCategoryIdById(id: PrimaryKey, topCategoryId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'second_category\' SET top_category_id = ? WHERE id = ?;');
    return prepare.run(topCategoryId, id).changes;
  }

  public updateNextIdById(id: PrimaryKey, nextId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'second_category\' SET next_id = ? WHERE id = ?;');
    return prepare.run(nextId, id).changes;
  }

  public updatePrevIdById(id: PrimaryKey, prevId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'second_category\' SET prev_id = ? WHERE id = ?;');
    return prepare.run(prevId, id).changes;
  }

  public updatePrevIdNextIdById(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'second_category\' SET prev_id = ?, next_id = ? WHERE id = ?;');
    return prepare.run(prevId, nextId, id).changes;
  }

  public deleteById(id: PrimaryKey): number {
    const prepare = this.db.prepare('DELETE FROM \'second_category\' WHERE id = ?;');
    return prepare.run(id).changes;
  }
}


export default SecondCategoryDao;