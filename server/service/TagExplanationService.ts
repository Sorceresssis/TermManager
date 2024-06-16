import n_fs from "node:fs"
import n_path from "node:path";
import { injectable } from "inversify";
import config from "../config";
import provider from "../provider/provider";
import injectType from '../provider/injectType';
import type TagService from "../service/TagService";
import TagExplanationV1Constant from "../constant/TagExplanationV1Constant";
import TagExplanationV0Constant from "../constant/TagExplanationV0Constant";


@injectable()
class TagExplanationService {

    /**
     * 创建tag的说明文档， 并且写入文档框架
     * @param tag
     */
    public writeTagExplanationFrame(tag: VO.Tag): void {
        n_fs.writeFileSync(
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
        if (!n_fs.existsSync(fileFullPath)) {
            this.writeTagExplanationFrame(tag);
            return;
        }

        n_fs.readFile(fileFullPath, 'utf8', (err, data) => {
            if (err) throw err;

            const replacedContent = data.replace(
                TagExplanationV1Constant.frame_regex[0],
                TagExplanationV1Constant.getTagExplanationFrame(tag)[0]
            )

            n_fs.writeFile(fileFullPath, replacedContent, 'utf8', (err) => {
                if (err) throw err;
            })
        })
    }

    public revisionTagExplanation() {
        n_fs.mkdirSync(config.revisionTagExplanationDir, { recursive: true });

        n_fs.readdir(config.tagExplanationDir, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                const filePath = n_path.join(config.tagExplanationDir, file);
                n_fs.stat(filePath, (err, stats) => {
                    if (err) throw err;
                    if (stats.isDirectory()) return
                    // 提取id
                    const fileBasename = n_path.basename(file, '.md');

                    const tag = provider.get<TagService>(injectType.TagService).queryTagById(Number(fileBasename));

                    n_fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) throw err;

                        const replacedContent = data.replace(
                            TagExplanationV0Constant.frame_regex[0],
                            TagExplanationV1Constant.getTagExplanationFrame(tag)[0]
                        )

                        n_fs.writeFile(config.revisionTagExplanationDir, replacedContent, 'utf8',
                            (err) => {
                                if (err) throw err;
                                console.log(`文件${file}已更新`)
                            }
                        )
                    })
                })
            })
        })

    }
}


export default TagExplanationService