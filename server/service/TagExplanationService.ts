import nodeFs from 'node:fs';

import { injectable } from 'inversify';

import ResourcePath from '@/config/resource-path';
import TagExplanationConfig from '@/config/tag-explanaion-config';
import { ensureFilePath, fsExists } from '@/helper/fs.helper';


@injectable()
class TagExplanationService {

  /**
     * 创建tag的说明文档， 并且写入文档框架
     * @param tag
     */
  public async writeTagExplanationIndexFrame(tag: VO.Tag): Promise<void> {
    const path = await ensureFilePath(ResourcePath.getTagExplanationItemIndexFile(tag.id));
    await nodeFs.promises.writeFile(path, TagExplanationConfig.genTagExplanationIndexFrame(tag)[0]);
  }

  /**
     * 更新tag的说明文档， 如果文件不存在就创建文件
     * @param tag
     */
  public async updateTagExplanationIndex(tag: VO.Tag): Promise<void> {
    const path = await ensureFilePath(ResourcePath.getTagExplanationItemIndexFile(tag.id));

    const isExists = await fsExists(path);
    if (!isExists) {
      await this.writeTagExplanationIndexFrame(tag);
      return;
    }

    const oldData = await nodeFs.promises.readFile(path, 'utf8');
    const newData = oldData.replace(TagExplanationConfig.hitFrameReg[0], TagExplanationConfig.genTagExplanationIndexFrame(tag)[0]);

    await nodeFs.promises.writeFile(path, newData, 'utf8');
  }
}


export default TagExplanationService;