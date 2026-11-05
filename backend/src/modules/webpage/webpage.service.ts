import ejs from 'ejs';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { exit } from 'node:process';

import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
    SubscriptionPageRawConfigSchema,
    TSubscriptionPageRawConfig,
    SUBPAGE_DEFAULT_CONFIG_UUID,
} from '@remnawave/subscription-page-types';

import { AxiosService } from '@common/axios';
import { TypedConfigService } from '@common/config/app-config';
import { getAssetsPath, isDevelopment, rejectRequest } from '@common/utils';
import { decryptUuid, encryptUuid } from '@common/utils/crypt-utils';

@Injectable()
export class WebpageService implements OnApplicationBootstrap {
    private readonly logger = new Logger(WebpageService.name);
    private readonly internalJwtSecret: string;
    private readonly subpageConfigUuid: string;
    private readonly subpageConfigMap: Map<string, TSubscriptionPageRawConfig> = new Map();
    private indexTemplate: ejs.TemplateFunction;

    constructor(
        private readonly configService: TypedConfigService,
        private readonly axiosService: AxiosService,
        private readonly jwtService: JwtService,
    ) {
        this.internalJwtSecret = this.configService.getOrThrow('INTERNAL_JWT_SECRET');
        this.subpageConfigUuid = this.configService.getOrThrow('SUBPAGE_CONFIG_UUID');
    }

    public async onApplicationBootstrap(): Promise<void> {
        this.indexTemplate = ejs.compile(
            readFileSync(path.join(getAssetsPath(), 'index.html'), 'utf8'),
        );

        const subscriptionPageConfigList = await this.fetchSubscriptionPageConfigList();

        if (subscriptionPageConfigList.length === 0) {
            this.logger.error('[FATAL] Subscription page config list is empty, exiting...');

            exit(1);
        }

        this.logger.log(`Found ${subscriptionPageConfigList.length} subscription page configs.`);

        for (const config of subscriptionPageConfigList) {
            const subscriptionPageConfig =
                await this.axiosService.getSubscriptionPageConfigByUuid(config);

            if (!subscriptionPageConfig.isOk || !subscriptionPageConfig.response) {
                this.logger.error(
                    `[FATAL] Error while fetching one of subpage config: ${config}, exiting...`,
                );

                exit(1);
            }

            const parsedConfig = await SubscriptionPageRawConfigSchema.safeParseAsync(
                subscriptionPageConfig.response.config,
            );

            if (!parsedConfig.success) {
                this.logger.error(
                    `[FATAL] ${config} is not valid: ${JSON.stringify(parsedConfig.error)}`,
                );

                exit(1);
            }

            this.logger.log(`[OK] ${config}`);
            this.subpageConfigMap.set(config, parsedConfig.data);
        }

        if (this.subpageConfigMap.size === 0) {
            this.logger.error('[FAILED] At least one SubPage config must be valid!');
            exit(1);
        }

        this.logger.log('[OK] Subpage configs are loaded successfully.');
    }

    public async getSubscriptionPageConfig(
        encryptedSubpageConfigUuid: string,
    ): Promise<object | void> {
        const decryptedSubpageConfigUuid = decryptUuid(
            encryptedSubpageConfigUuid,
            this.internalJwtSecret,
        );

        if (!decryptedSubpageConfigUuid) {
            this.logger.error(`[FATAL] SubPage config ${encryptedSubpageConfigUuid} is not valid`);
            throw new NotFoundException();
        }

        const subpageConfig = this.subpageConfigMap.get(decryptedSubpageConfigUuid);

        if (!subpageConfig) {
            this.logger.error(`[FATAL] SubPage config ${decryptedSubpageConfigUuid} not found`);
            throw new NotFoundException();
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
        return encryptUuid(
            this.getFinalSubpageConfigUuid(subpageConfigUuidFromRemnawave),
            this.internalJwtSecret,
        );
    }

    public getBaseSettings(
        subpageConfigUuid: string | null,
    ): TSubscriptionPageRawConfig['baseSettings'] {
        const subpageConfig = this.subpageConfigMap.get(
            this.getFinalSubpageConfigUuid(subpageConfigUuid),
        );

        if (!subpageConfig) {
            return {
                metaTitle: 'Subscription Page',
                metaDescription: 'Subscription Page',
                showConnectionKeys: false,
                hideGetLinkButton: false,
            };
        }

        return {
            metaTitle: subpageConfig.baseSettings.metaTitle,
            metaDescription: subpageConfig.baseSettings.metaDescription,
            showConnectionKeys: subpageConfig.baseSettings.showConnectionKeys,
            hideGetLinkButton: subpageConfig.baseSettings.hideGetLinkButton,
        };
    }

    private getFinalSubpageConfigUuid(subpageConfigUuid: string | null): string {
        let finalSubpageConfigUuid: string;

        const isDefaultUuid = this.subpageConfigUuid === SUBPAGE_DEFAULT_CONFIG_UUID;

        if (isDefaultUuid && subpageConfigUuid) {
            finalSubpageConfigUuid = subpageConfigUuid;
        } else {
            finalSubpageConfigUuid = this.subpageConfigUuid;
        }

        return finalSubpageConfigUuid;
    }

    private generateJwtForCookie(uuid: string | null): string {
        return this.jwtService.sign(
            {
                sessionId: nanoid(32),
                su: this.getEncryptedSubpageConfigUuid(uuid),
            },
            {
                expiresIn: '33m',
            },
        );
    }

    public async serveWebpage(
        clientIp: string,
        req: Request,
        res: Response,
        shortUuid: string,
    ): Promise<void> {
        try {
            const subscriptionDataResponse = await this.axiosService.getSubscriptionInfo(
                clientIp,
                shortUuid,
            );

            if (!subscriptionDataResponse.isOk || !subscriptionDataResponse.response) {
                rejectRequest(res, 404);
                return;
            }

            const subpageConfigResponse = await this.axiosService.getSubpageConfig(
                shortUuid,
                req.headers,
            );

            if (!subpageConfigResponse.isOk || !subpageConfigResponse.response) {
                rejectRequest(res, 404);
                return;
            }

            const subpageConfig = subpageConfigResponse.response;

            if (subpageConfig.webpageAllowed === false) {
                this.logger.log(`Webpage access is not allowed by Remnawave's SRR.`);
                rejectRequest(res, 403);
                return;
            }

            const baseSettings = this.getBaseSettings(subpageConfig.subpageConfigUuid);

            const subscriptionData = subscriptionDataResponse.response;

            if (!baseSettings.showConnectionKeys) {
                subscriptionData.response.links = [];
                subscriptionData.response.ssConfLinks = {};
            }

            res.cookie('session', this.generateJwtForCookie(subpageConfig.subpageConfigUuid), {
                httpOnly: true,
                secure: !isDevelopment(),
                maxAge: 1_800_000, // 30 minutes
            });

            res.type('html').send(
                this.indexTemplate({
                    metaTitle: baseSettings.metaTitle,
                    metaDescription: baseSettings.metaDescription,
                    panelData: Buffer.from(JSON.stringify(subscriptionData)).toString('base64'),
                }),
            );
        } catch (error) {
            this.logger.error(`Error in returnWebpage: ${error}`);

            rejectRequest(res, 500);
            return;
        }
    }
}
