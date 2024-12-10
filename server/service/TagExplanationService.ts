import nodeFs from 'node:fs';

import { injectable } from 'inversify';

import ResourcePath from '@/config/resource-path';
import TagExplanationConfig from '@/config/tag-explanaion-config';
import { ensureDirPath, ensureFilePath, fsExists } from '@/helper/fs.helper';


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

  public async createTagExplanationRef(tagId:number):Promise<VO.TagExplanationRefInfo> {
    const itemDirPath = ResourcePath.getTagExplanationItemDir(tagId);
    await ensureDirPath(itemDirPath);
    const itemDirContentList = await nodeFs.promises.readdir(itemDirPath);

    const newRefIndex = itemDirContentList.reduce((maxIdx, file) => {
      const index = file.match(ResourcePath.TagExplanationItemRefFilenameRegex)?.[1];
      if (index === void 0) return maxIdx;
      return Math.max(maxIdx, parseInt(index, 10));
    }, 0) + 1;

    const newRefFilePath = ResourcePath.getTagExplanationItemRefFile(tagId, newRefIndex);
    await nodeFs.promises.writeFile(newRefFilePath, TagExplanationConfig.genTagExplanationReferenceFrame(tagId, newRefIndex)[0]);

    return {
      tagId: tagId,
      refIndex: newRefIndex,
      localPath: newRefFilePath,
    };
  }

  public async formatTagExplanation(tagId:number, refIndex?:number) {
    let filePath = '';
    if (refIndex === void 0) {
      filePath = ResourcePath.getTagExplanationItemIndexFile(tagId);
    } else {
      filePath = ResourcePath.getTagExplanationItemRefFile(tagId, refIndex);
    }

    const isExists = await fsExists(filePath);
    if (!isExists) return;

    const oldData = await nodeFs.promises.readFile(filePath, 'utf8');

    // 将 [xxx](xxx) 转换为 <a href="xxx" target="_blank" rel="noopener noreferrer">xxx</a>
    const newData = oldData.replace(/([^!])\[(.*?)\]\((.*?)\)/g, (match, prefix, text, url) => {
      return `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    await nodeFs.promises.writeFile(filePath, newData, 'utf8');
  }
}


export default TagExplanationService;