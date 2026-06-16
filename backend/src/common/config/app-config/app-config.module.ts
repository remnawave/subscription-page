import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnvConfig } from '@common/utils/validate-env-config';

import { TypedConfigService } from './typed-config.service';
import { configSchema, Env } from '.';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
            validate: (config) => validateEnvConfig<Env>(configSchema, config),
        }),
    ],
    providers: [TypedConfigService],
    exports: [TypedConfigService],
})
export class AppConfigModule {}
