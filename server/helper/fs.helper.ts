import nodeFs from 'node:fs';
import nodePath from 'node:path';

export function ensureFilePathSync(path: string): string {
  nodeFs.mkdirSync(nodePath.dirname(path), {
    recursive: true,
  });
  return path;
}

export async function ensureFilePath(path:string):Promise<string> {
  await nodeFs.promises.mkdir(nodePath.dirname(path), {
    recursive: true,
  });
  return path;
}

export function ensureDirPathSync(path: string): string {
  nodeFs.mkdirSync(path, {
    recursive: true,
  });
  return path;
}

export async function ensureDirPath(path: string): Promise<string> {
  await nodeFs.promises.mkdir(path, {
    recursive: true,
  });
  return path;
}

export async function fsExists(path:string) :Promise<boolean> {
  try {
    await nodeFs.promises.access(path, nodeFs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}