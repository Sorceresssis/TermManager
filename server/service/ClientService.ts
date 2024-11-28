import nodeFs from 'node:fs';

import { injectable } from 'inversify';

import config from '../config';

type ClientConfig = {
    title: string
}


@injectable()
class ClientService {
  private clientConfig: ClientConfig;

  private defaultClientConfig: ClientConfig = {
    title: 'TermManager',
  };

  public constructor() {
    this.clientConfig = nodeFs.existsSync(config.clientConfigPath)
      ? JSON.parse(nodeFs.readFileSync(config.clientConfigPath, 'utf8'))
      : this.defaultClientConfig;
  }

  public getClientConfig(): ClientConfig {
    return this.clientConfig;
  }
}

export default ClientService;