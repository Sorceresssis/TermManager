import { injectable } from "inversify";
import config from "../config";
import node_fs from "node:fs";

type ClientConfig = {
    title: string
}


@injectable()
class ClientService {
    private clientConfig: ClientConfig

    private defaultClientConfig: ClientConfig = {
        title: 'TermManager'
    }

    public constructor() {
        this.clientConfig = node_fs.existsSync(config.clientConfigPath)
            ? JSON.parse(node_fs.readFileSync(config.clientConfigPath, 'utf8'))
            : this.defaultClientConfig
    }

    public getClientConfig(): ClientConfig {
        return this.clientConfig;
    }
}

export default ClientService;