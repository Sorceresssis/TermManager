import DatabaseConstructor from 'better-sqlite3';
import nodeFs from 'fs';

import { ensureFilePathSync } from '@/helper/fs.helper';

class TagDB extends DatabaseConstructor {

  public constructor(path: string) {
    const isExist = nodeFs.existsSync(path);

    ensureFilePathSync(path);
    super(path);

    if (!isExist) {
      this.defineData();
    }

    this.pragma('journal_mode = WAL'); // 开启wal模式
  }

  private defineData(): void {
    this.transaction(() => {
      this.exec(`
            DROP TABLE IF EXISTS 'top_category';
            CREATE TABLE 'top_category'
            (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' VARCHAR(255) NOT NULL,
                'prev_id' INTEGER  DEFAULT 0 NOT NULL,
                'next_id' INTEGER  DEFAULT 0 NOT NULL,

                'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                'gmt_update' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
            CREATE INDEX 'idx_top_category(prev_id)' ON 'top_category'('prev_id');
            CREATE INDEX 'idx_top_category(next_id)' ON 'top_category'('next_id');


            DROP TABLE IF EXISTS 'second_category';
            CREATE TABLE 'second_category'
            (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' VARCHAR(255) NOT NULL,
                'prev_id' INTEGER  DEFAULT 0 NOT NULL,
                'next_id' INTEGER  DEFAULT 0 NOT NULL,
                'top_category_id' INTEGER NOT NULL,

                'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                'gmt_update' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
            CREATE INDEX 'idx_second_category(prev_id)' ON 'second_category'('prev_id');
            CREATE INDEX 'idx_second_category(next_id)' ON 'second_category'('next_id');
            CREATE INDEX 'idx_second_category(top_category_id)' ON 'second_category'('top_category_id');


            DROP TABLE IF EXISTS 'tag';
            CREATE TABLE 'tag'
            (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' VARCHAR(255) NOT NULL,
                'name_zh' VARCHAR(255) DEFAULT '' NOT NULL,
                'name_ja' VARCHAR(255) DEFAULT '' NOT NULL,
                'name_en' VARCHAR(255) DEFAULT '' NOT NULL,
                'prev_id' INTEGER  DEFAULT 0 NOT NULL,
                'next_id' INTEGER  DEFAULT 0 NOT NULL,
                'second_category_id' INTEGER NOT NULL,

                'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                'gmt_update' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
            CREATE INDEX 'idx_tag(prev_id)' ON 'tag'('prev_id');
            CREATE INDEX 'idx_tag(next_id)' ON 'tag'('next_id');
            CREATE INDEX 'idx_tag(second_category_id)' ON 'tag'('second_category_id');
            `);
    })();
  }

  // 升级数据库
  public upgradeDB(): void {
  }
}


export default TagDB;