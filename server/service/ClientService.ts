import nodeFs from 'node:fs';

import { injectable } from 'inversify';

import ResourcePath from '@/config/resource-path';
import { isNullish } from '@/helper/common.helper';

interface IClientConfig {
  readonly title: string
}

@injectable()
class ClientService {
  private clientConfig: IClientConfig;


  public constructor() {
    const isExists = nodeFs.existsSync(ResourcePath.CLIENT_CONFIG_File);

    if (!isExists) {
      throw new Error('"client-config.json" file not found');
    }

    const parsedConfig = JSON.parse(nodeFs.readFileSync(ResourcePath.CLIENT_CONFIG_File, 'utf8'));
    this.validateClientConfig(parsedConfig);

    this.clientConfig = parsedConfig;
  }

  private validateClientConfig(config:any) {
    if (isNullish(config['title'])) {
      throw new Error('"client-config.json" file is invalid, title is required');
    }
  }

  public getClientConfig(): IClientConfig {
    return this.clientConfig;
  }
}

export default ClientService;