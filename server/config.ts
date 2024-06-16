import node_path from "node:path";
import node_fs from "node:fs"
import { isRunningWithTsNode } from "./utils/runtime";


const generateConfig = () => {
    enum DataPathFlag {
        WITH_PROJECT = 'WITH_PROJECT',
        NOT_WITH_PROJECT = 'NOT_WITH_PROJECT'
    }

    const dataPathFlag = DataPathFlag.WITH_PROJECT;
    // const dataPathFlag = DataPathFlag.NOT_WITH_PROJECT;

    /**
     * 直接运行ts-node时，不需要返回上一级，编译后的代码在dist目录下,要返回上一级才能到达源代码目录
     * 为了写代码时方便编辑器提示，设置了这个常量
     */
    const DIST_TO_SRC = isRunningWithTsNode() ? '' : '../';
    const CUSTOM_DATA_DIR = '';

    // @ts-ignore
    const DATA_DIR = dataPathFlag === DataPathFlag.WITH_PROJECT ? node_path.join(__dirname, DIST_TO_SRC, '../data') : CUSTOM_DATA_DIR

    const clientDir = node_path.join(__dirname, DIST_TO_SRC, '../client/dist');
    const tagDBPath = node_path.join(DATA_DIR, './db/tag.db');
    const tagExplanationDir = node_path.join(DATA_DIR, './tag-explanation');
    const revisionTagExplanationDir = node_path.join(__dirname, DIST_TO_SRC, '../revision-tag-explanation')
    const clientConfigPath = node_path.join(DATA_DIR, './client_config.json')

    node_fs.mkdirSync(node_path.dirname(tagDBPath), { recursive: true })
    node_fs.mkdirSync(tagExplanationDir, { recursive: true })

    const getTagExplanationFile = (tagId: number) => {
        return node_path.join(tagExplanationDir, `${tagId}.md`);
    }

    const getTagExplanationImagesDir = (tagId: number) => {
        return node_path.join(tagExplanationDir, `assets/${tagId}/images`);
    }

    return {
        clientDir,
        tagDBPath,
        tagExplanationDir,
        clientConfigPath,
        revisionTagExplanationDir,

        getTagExplanationFile,
        getTagExplanationImagesDir
    }
}

const config = generateConfig();

export default config;