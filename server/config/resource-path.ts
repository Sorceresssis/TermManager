import nodePath from 'node:path';

import setting from '@/config/settings';

const DIST_TO_SRC = '../';

function parseDataPath(dataPath: string): string {
  if (!dataPath) {
    return nodePath.join(__dirname, DIST_TO_SRC, '../../data');
  }

  if (nodePath.isAbsolute(dataPath)) {
    return nodePath.normalize(dataPath);
  } else {
    return nodePath.join(__dirname, DIST_TO_SRC, '../', dataPath);
  }
}


class ResourcePath {
  public static readonly CLIENT_DIR = nodePath.join(__dirname, DIST_TO_SRC, '../../client/dist');

  public static readonly DATA_DIR = parseDataPath(setting.DATA_PATH);

  public static readonly TAG_DATABASE_FILE = nodePath.join(ResourcePath.DATA_DIR, './database/tag.db');

  public static readonly TAG_EXPLANATIONS_DIR = nodePath.join(ResourcePath.DATA_DIR, './tag-explanations');

  public static readonly CLIENT_CONFIG_File = nodePath.join(ResourcePath.DATA_DIR, './client-config.json');

  public static getTagExplanationItemDir(id:number) {
    return nodePath.join(ResourcePath.TAG_EXPLANATIONS_DIR, `${id}`);
  }

  public static getTagExplanationItemDeletedDir(id: number) {
    return nodePath.join(ResourcePath.TAG_EXPLANATIONS_DIR, `${id}_deleted`);
  }

  public static getTagExplanationItemIndexFile(id: number) {
    return nodePath.join(ResourcePath.TAG_EXPLANATIONS_DIR, `${id}`, 'index.md');
  }

  public static getTagExplanationItemIconFile(id: number) {
    return nodePath.join(ResourcePath.TAG_EXPLANATIONS_DIR, `${id}`, 'icon.jpg');
  }
}

export default ResourcePath;