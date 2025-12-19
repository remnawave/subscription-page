import { exit } from 'node:process';
import { Request } from 'express';

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import {
    SubscriptionPageRawConfigSchema,
    TSubscriptionPageRawConfig,
} from '@remnawave/subscription-page-types';

import { decryptUuid, encryptUuid } from '@common/utils/crypt-utils';
import { AxiosService } from '@common/axios';

@Injectable()
export class SubpageConfigService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SubpageConfigService.name);
    private readonly internalJwtSecret: string;
    private readonly subpageConfigUuid: string;
    private readonly subpageConfigMap: Map<string, TSubscriptionPageRawConfig> = new Map();

    constructor(
        private readonly configService: ConfigService,
        private readonly axiosService: AxiosService,
    ) {
        this.internalJwtSecret = this.configService.getOrThrow<string>('INTERNAL_JWT_SECRET');
        this.subpageConfigUuid = this.configService.getOrThrow<string>('SUBPAGE_CONFIG_UUID');
    }

    public async onApplicationBootstrap(): Promise<void> {
        const subscriptionPageConfigList = await this.fetchSubscriptionPageConfigList();

        if (subscriptionPageConfigList.length === 0) {
            this.logger.error('Subscription page config list is empty');
            exit(1);
        }

        this.logger.log(`Found ${subscriptionPageConfigList.length} subscription page configs.`);

        for (const config of subscriptionPageConfigList) {
            const subscriptionPageConfig =
                await this.axiosService.getSubscriptionPageConfigByUuid(config);
            if (!subscriptionPageConfig.isOk || !subscriptionPageConfig.response) {
                this.logger.error(`Subscription page config ${config} cannot be fetched`);
                continue;
            }

            const parsedConfig = await SubscriptionPageRawConfigSchema.safeParseAsync(
                subscriptionPageConfig.response.config,
            );

            if (!parsedConfig.success) {
                this.logger.error(
                    `[ERROR] ${config} is not valid: ${JSON.stringify(parsedConfig.error)}`,
                );

                continue;
            }

            this.logger.log(`[OK] ${config}`);
            this.subpageConfigMap.set(config, parsedConfig.data);
        }

        if (this.subpageConfigMap.size === 0) {
            this.logger.error('[FAILED] At least one SubPage config must be valid!');
            exit(1);
        }
    }

    public async getSubscriptionPageConfig(
        encryptedSubpageConfigUuid: string,
        req: Request,
    ): Promise<object | void> {
        const decryptedSubpageConfigUuid = decryptUuid(
            encryptedSubpageConfigUuid,
            this.internalJwtSecret,
        );

        if (!decryptedSubpageConfigUuid) {
            req.socket?.destroy();
            return;
        }

        const subpageConfig = this.subpageConfigMap.get(decryptedSubpageConfigUuid);

        if (!subpageConfig) {
            this.logger.error(`[FATAL] SubPage config ${decryptedSubpageConfigUuid} not found`);
            req.socket?.destroy();

            return;
        }

        return subpageConfig;
    }

    private async fetchSubscriptionPageConfigList(): Promise<string[]> {
        const subscriptionPageConfigList = await this.axiosService.getSubscriptionPageConfigList();
        if (!subscriptionPageConfigList.isOk || !subscriptionPageConfigList.response) {
            this.logger.error('Subscription page config list cannot be fetched');
            return [];
        }

        return subscriptionPageConfigList.response.configs.map((config) => config.uuid);
    }

    public getEncryptedSubpageConfigUuid(subpageConfigUuidFromRemnawave: string | null): string {
        let uuidToEncrypt: string;

        const isDefaultUuid = this.subpageConfigUuid === '00000000-0000-0000-0000-000000000000';

        if (isDefaultUuid && subpageConfigUuidFromRemnawave) {
            uuidToEncrypt = subpageConfigUuidFromRemnawave;
        } else {
            uuidToEncrypt = this.subpageConfigUuid;
        }

        return encryptUuid(uuidToEncrypt, this.internalJwtSecret);
    }
}
