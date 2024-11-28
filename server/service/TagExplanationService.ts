import nodeFs from 'node:fs';
import nodePath from 'node:path';

import { injectable } from 'inversify';

import config from '../config';
import TagExplanationV0Constant from '../constant/TagExplanationV0Constant';
import TagExplanationV1Constant from '../constant/TagExplanationV1Constant';
import injectType from '../provider/injectType';
import provider from '../provider/provider';
import type TagService from '../service/TagService';


@injectable()
class TagExplanationService {

  /**
     * 创建tag的说明文档， 并且写入文档框架
     * @param tag
     */
  public writeTagExplanationFrame(tag: VO.Tag): void {
    nodeFs.writeFileSync(
      config.getTagExplanationFile(tag.id),
      TagExplanationV1Constant.getTagExplanationFrame(tag)[0]
    );
  }

  /**
     * 更新tag的说明文档， 如果文件不存在就创建文件
     * @param tag
     */
  public updateTagExplanation(tag: VO.Tag): void {
    const fileFullPath = config.getTagExplanationFile(tag.id);

    // 如果文件不存在就创建文件
    if (!nodeFs.existsSync(fileFullPath)) {
      this.writeTagExplanationFrame(tag);
      return;
    }

    nodeFs.readFile(fileFullPath, 'utf8', (err, data) => {
      if (err) throw err;

      const replacedContent = data.replace(
        TagExplanationV1Constant.frame_regex[0],
        TagExplanationV1Constant.getTagExplanationFrame(tag)[0]
      );

      nodeFs.writeFile(fileFullPath, replacedContent, 'utf8', err => {
        if (err) throw err;
      });
    });
  }

  public revisionTagExplanation() {
    nodeFs.mkdirSync(config.revisionTagExplanationDir, {
      recursive: true,
    });

    nodeFs.readdir(config.tagExplanationDir, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        const filePath = nodePath.join(config.tagExplanationDir, file);
        nodeFs.stat(filePath, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) return;
          // 提取id
          const fileBasename = nodePath.basename(file, '.md');

          const tag = provider.get<TagService>(injectType.TagService).queryTagById(Number(fileBasename));

          nodeFs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;

            const replacedContent = data.replace(
              TagExplanationV0Constant.frame_regex[0],
              TagExplanationV1Constant.getTagExplanationFrame(tag)[0]
            );

            nodeFs.writeFile(config.revisionTagExplanationDir, replacedContent, 'utf8',
              err => {
                if (err) throw err;
                console.log(`文件${file}已更新`);
              }
            );
          });
        });
      });
    });

  }
}


export default TagExplanationService;