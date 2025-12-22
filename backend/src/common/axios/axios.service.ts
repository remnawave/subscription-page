import type { IncomingHttpHeaders } from 'node:http';

import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponseHeaders,
    RawAxiosResponseHeaders,
} from 'axios';
import { exit } from 'node:process';
import { table } from 'table';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    GetStatusCommand,
    GetSubpageConfigByShortUuidCommand,
    GetSubscriptionInfoByShortUuidCommand,
    GetSubscriptionPageConfigCommand,
    GetSubscriptionPageConfigsCommand,
    GetUserByUsernameCommand,
    REMNAWAVE_REAL_IP_HEADER,
    TRequestTemplateTypeKeys,
} from '@remnawave/backend-contract';

import { ICommandResponse } from '../types/command-response.type';

@Injectable()
export class AxiosService implements OnModuleInit {
    public axiosInstance: AxiosInstance;
    private readonly logger = new Logger(AxiosService.name);

    constructor(private readonly configService: ConfigService) {
        this.axiosInstance = axios.create({
            baseURL: this.configService.getOrThrow('REMNAWAVE_PANEL_URL'),
            timeout: 10_000,
            headers: {
                'user-agent': 'Remnawave Subscription Page',
                Authorization: `Bearer ${this.configService.getOrThrow('REMNAWAVE_API_TOKEN')}`,
            },
        });

        const caddyAuthApiToken = this.configService.get<string | undefined>(
            'CADDY_AUTH_API_TOKEN',
        );

        const cloudflareZeroTrustClientId = this.configService.get<string | undefined>(
            'CLOUDFLARE_ZERO_TRUST_CLIENT_ID',
        );
        const cloudflareZeroTrustClientSecret = this.configService.get<string | undefined>(
            'CLOUDFLARE_ZERO_TRUST_CLIENT_SECRET',
        );

        if (caddyAuthApiToken) {
            this.axiosInstance.defaults.headers.common['X-Api-Key'] = caddyAuthApiToken;
        }

        if (cloudflareZeroTrustClientId && cloudflareZeroTrustClientSecret) {
            this.axiosInstance.defaults.headers.common['CF-Access-Client-Id'] =
                cloudflareZeroTrustClientId;
            this.axiosInstance.defaults.headers.common['CF-Access-Client-Secret'] =
                cloudflareZeroTrustClientSecret;
        }

        if (this.configService.getOrThrow('REMNAWAVE_PANEL_URL').startsWith('http://')) {
            this.axiosInstance.defaults.headers.common['X-Forwarded-For'] = '127.0.0.1';
            this.axiosInstance.defaults.headers.common['X-Forwarded-Proto'] = 'https';
        }
    }

    async onModuleInit(): Promise<void> {
        this.logger.log(`Remnawave API URL: ${this.axiosInstance.defaults.baseURL}`);

        const authStatus = await this.getAuthStatus();
        if (!authStatus.isOk) {
            this.logger.error(
                '\n' +
                    table([['Is the panel online and reachable from this server?']], {
                        header: {
                            content: `Connection to Remnawave Panel failed!`,
                            alignment: 'center',
                        },
                        columnDefault: {
                            width: 70,
                            alignment: 'center',
                            wrapWord: true,
                        },
                        drawVerticalLine: () => false,
                    }) +
                    '\n',
            );
            this.logger.error(authStatus.error);

            exit(1);
        } else {
            this.logger.log('Connection to Remnawave established successfully.');
        }
    }

    public async getAuthStatus(): Promise<{
        isOk: boolean;
        error?: unknown;
    }> {
        try {
            const response = await this.axiosInstance.request<GetStatusCommand.Response>({
                method: GetStatusCommand.endpointDetails.REQUEST_METHOD,
                url: GetStatusCommand.TSQ_url,
            });

            await GetStatusCommand.ResponseSchema.parseAsync(response.data);

            return {
                isOk: true,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    isOk: false,
                    error: error.message,
                };
            } else {
                return {
                    isOk: false,
                    error: error,
                };
            }
        }
    }

    public async getUserByUsername(
        clientIp: string,
        username: string,
    ): Promise<ICommandResponse<GetUserByUsernameCommand.Response>> {
        try {
            const response = await this.axiosInstance.request<GetUserByUsernameCommand.Response>({
                method: GetUserByUsernameCommand.endpointDetails.REQUEST_METHOD,
                url: GetUserByUsernameCommand.url(username),
                headers: {
                    [REMNAWAVE_REAL_IP_HEADER]: clientIp,
                },
            });

            return {
                isOk: true,
                response: response.data,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                this.logger.error('Error in Axios GetUserByUsername Request:', error.message);

                return {
                    isOk: false,
                };
            } else {
                this.logger.error('Error in GetUserByUsername Request:', error);

                return {
                    isOk: false,
                };
            }
        }
    }

    public async getSubscriptionPageConfigByUuid(
        uuid: string,
    ): Promise<ICommandResponse<GetSubscriptionPageConfigCommand.Response['response']>> {
        try {
            const response =
                await this.axiosInstance.request<GetSubscriptionPageConfigCommand.Response>({
                    method: GetSubscriptionPageConfigCommand.endpointDetails.REQUEST_METHOD,
                    url: GetSubscriptionPageConfigCommand.url(uuid),
                });

            return {
                isOk: true,
                response: response.data.response,
            };
        } catch (error) {
            this.logger.error('Error in GetSubscriptionPageConfigByUuid Request:', error);

            return { isOk: false };
        }
    }

    public async getSubscriptionPageConfigList(): Promise<
        ICommandResponse<GetSubscriptionPageConfigsCommand.Response['response']>
    > {
        try {
            const response =
                await this.axiosInstance.request<GetSubscriptionPageConfigsCommand.Response>({
                    method: GetSubscriptionPageConfigsCommand.endpointDetails.REQUEST_METHOD,
                    url: GetSubscriptionPageConfigsCommand.url,
                });

            const validationResult =
                await GetSubscriptionPageConfigsCommand.ResponseSchema.parseAsync(response.data);

            return {
                isOk: true,
                response: validationResult.response,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    this.logger.error('Request failed with 404 status code.');
                    this.logger.error(
                        'This version of Subscription Page requires Remnawave Panel version >=2.4.0. Please upgrade Remnawave Panel to the latest version or downgrade Subscription Page.',
                    );
                    return { isOk: false };
                }

                this.logger.error(`Subpage Config List Request failed: ${error.message}`);
                return { isOk: false };
            } else {
                this.logger.error(`Subpage Config List Request failed: ${error}`);
                return { isOk: false };
            }
        }
    }

    public async getSubscriptionInfo(
        clientIp: string,
        shortUuid: string,
    ): Promise<ICommandResponse<GetSubscriptionInfoByShortUuidCommand.Response>> {
        try {
            const response =
                await this.axiosInstance.request<GetSubscriptionInfoByShortUuidCommand.Response>({
                    method: GetSubscriptionInfoByShortUuidCommand.endpointDetails.REQUEST_METHOD,
                    url: GetSubscriptionInfoByShortUuidCommand.url(shortUuid),
                    headers: {
                        [REMNAWAVE_REAL_IP_HEADER]: clientIp,
                    },
                });

            return {
                isOk: true,
                response: response.data,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                this.logger.error('Error in GetSubscriptionInfo Request:', error.message);
            } else {
                this.logger.error('Error in GetSubscriptionInfo Request:', error);
            }

            return { isOk: false };
        }
    }

    public async getSubpageConfig(
        shortUuid: string,
        requestHeaders: IncomingHttpHeaders,
    ): Promise<ICommandResponse<GetSubpageConfigByShortUuidCommand.Response['response']>> {
        try {
            const response =
                await this.axiosInstance.request<GetSubpageConfigByShortUuidCommand.Response>({
                    method: GetSubpageConfigByShortUuidCommand.endpointDetails.REQUEST_METHOD,
                    url: GetSubpageConfigByShortUuidCommand.url(shortUuid),
                    data: {
                        requestHeaders,
                    },
                });

            return {
                isOk: true,
                response: response.data.response,
            };
        } catch (error) {
            this.logger.error('Error in GetSubpageConfig Request:', error);
            return { isOk: false };
        }
    }

    public async getSubscription(
        clientIp: string,
        shortUuid: string,
        headers: NodeJS.Dict<string | string[]>,
        withClientType: boolean = false,
        clientType?: TRequestTemplateTypeKeys,
    ): Promise<{
        response: unknown;
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    } | null> {
        try {
            let basePath = 'api/sub/' + shortUuid;

            if (withClientType && clientType) {
                basePath += '/' + clientType;
            }

            const response = await this.axiosInstance.request<unknown>({
                method: 'GET',
                url: basePath,
                headers: {
                    ...this.filterHeaders(headers),
                    [REMNAWAVE_REAL_IP_HEADER]: clientIp,
                },
            });

            return {
                response: response.data,
                headers: response.headers,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                this.logger.error('Error in GetSubscription Request:', error.message);
            } else {
                this.logger.error('Error in GetSubscription Request:', error);
            }

            return null;
        }
    }

    private filterHeaders(headers: NodeJS.Dict<string | string[]>): NodeJS.Dict<string | string[]> {
        const allowedHeaders = [
            'user-agent',
            'accept',
            'accept-language',
            'accept-encoding',
            'x-hwid',
            'x-device-os',
            'x-ver-os',
            'x-device-model',
            'x-app-version',
            'x-device-locale',
            'x-client',
        ];

        const filteredHeaders = Object.fromEntries(
            Object.entries(headers).filter(([key]) => allowedHeaders.includes(key)),
        );

        return filteredHeaders;
    }
}
