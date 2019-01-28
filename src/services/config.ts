import config from '../global/environment';

export class ConfigService {
  public get(name?: string) {
    return name ? config[name] : config;
  }
}
