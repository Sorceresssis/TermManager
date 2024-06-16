import node_path from "path";

export function getCallerFile(): string | undefined {
    const originalPrepareStackTrace = Error.prepareStackTrace;

    try {
        const err = new Error();
        Error.prepareStackTrace = (err, stack) => stack;
        const stack = err.stack as unknown as NodeJS.CallSite[];

        // 解析调用堆栈，堆栈中第一个元素是当前函数，第二个元素是调用者
        const callerFile = stack[2]?.getFileName();
        return callerFile;
    } catch (error) {
        console.error('Error getting caller file:', error);
        return undefined;
    } finally {
        Error.prepareStackTrace = originalPrepareStackTrace;
    }
}

export function isRunningWithTsNode(): boolean {
    const callerFile = getCallerFile();
    if (!callerFile) {
        throw new Error('Cannot determine caller file');
    }
    return node_path.extname(callerFile) === '.ts';
}


export default {
    getCallerFile,
    isRunningWithTsNode
}