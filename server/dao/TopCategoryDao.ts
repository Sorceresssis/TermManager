import { inject, injectable } from 'inversify';

import type TagDB from '@/database/tag-db';
import injectType from '@/provider/inject-type';


@injectable()
class TopCategoryDao {
  public constructor(
        @inject(injectType.TagDB) private db: TagDB
  ) { }

  public queryAll(): VO.TopCategory[] {
    const prepare = this.db.prepare(`
            WITH RECURSIVE 'top_category_list' AS (
                SELECT id, name, prev_id, next_id FROM 'top_category' WHERE prev_id = 0
                UNION ALL
                SELECT t.id, t.name, t.prev_id, t.next_id FROM 'top_category' t JOIN 'top_category_list' tl ON t.id = tl.next_id WHERE tl.next_id != 0
            )
            SELECT id, name FROM 'top_category_list';
        `);

    return prepare.all() as VO.TopCategory[];
  }

  public queryIdByPrevId(prevId: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT id FROM \'top_category\' WHERE prev_id = ?;');
    return prepare.pluck().get(prevId) as number | undefined;
  }

  public queryIdByNextId(nextId: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT id FROM \'top_category\' WHERE next_id = ?;');
    return prepare.pluck().get(nextId) as number | undefined;
  }

  public queryPrevIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT prev_id FROM \'top_category\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryNextIdById(id: PrimaryKey): number | undefined {
    const prepare = this.db.prepare('SELECT next_id FROM \'top_category\' WHERE id = ?;');
    return prepare.pluck().get(id) as number | undefined;
  }

  public queryPrevIdNextIdById(id: PrimaryKey): [number, number] | undefined {
    const prepare = this.db.prepare('SELECT prev_id, next_id FROM \'top_category\' WHERE id = ?;');
    return prepare.raw().get(id) as [number, number] | undefined;
  }

  public insert(info: BO.TopCategory): PrimaryKey {
    const prepare = this.db.prepare('INSERT INTO \'top_category\' (name) VALUES (?);');
    return prepare.run(info.name).lastInsertRowid;
  }

  public updateInfoById(info: BO.TopCategory): number {
    const prepare = this.db.prepare('UPDATE \'top_category\' SET name = ?, gmt_update = CURRENT_TIMESTAMP WHERE id = ?;');
    return prepare.run(info.name, info.id).changes;
  }

  public updateNextIdById(id: PrimaryKey, nextId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'top_category\' SET next_id = ? WHERE id = ?;');
    return prepare.run(nextId, id).changes;
  }

  public updatePrevIdById(id: PrimaryKey, prevId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'top_category\' SET prev_id = ? WHERE id = ?;');
    return prepare.run(prevId, id).changes;
  }

  public updatePrevIdNextIdById(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): number {
    const prepare = this.db.prepare('UPDATE \'top_category\' SET prev_id = ?, next_id = ? WHERE id = ?;');
    return prepare.run(prevId, nextId, id).changes;
  }

  public deleteById(id: PrimaryKey): number {
    const prepare = this.db.prepare('DELETE FROM \'top_category\' WHERE id = ?;');
    return prepare.run(id).changes;
  }
}


export default TopCategoryDao;