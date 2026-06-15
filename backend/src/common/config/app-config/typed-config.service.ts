import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigSchema } from '@common/config/app-config';

@Global()
@Injectable()
export class TypedConfigService {
    constructor(private readonly config: ConfigService<ConfigSchema, true>) {}

    get<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
        return this.config.get(key, { infer: true }) as ConfigSchema[K];
    }

    getOrThrow<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
        return this.config.getOrThrow(key, { infer: true }) as ConfigSchema[K];
    }
}
