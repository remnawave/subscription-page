import { Request, Response as ExpressResponse } from 'express';

import {
    BadGatewayException,
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';

import {
    REQUEST_TEMPLATE_TYPE_VALUES,
    TRequestTemplateTypeKeys,
} from '@remnawave/backend-contract';
import { APP_CONFIG_ROUTE_WO_LEADING_PATH } from '@remnawave/subscription-page-types';

import { AxiosService } from '@common/axios/axios.service';
import { GetJWTPayload } from '@common/decorators/get-jwt-payload';
import { ClientIp } from '@common/decorators/get-ip';
import { IJwtPayload } from '@common/constants';

import { SubpageConfigService } from './subpage-config.service';
import { RootService } from './root.service';

const HAPP_CRYPT5_API_URL = 'https://crypto.happ.su/api-v2.php';
const HAPP_CRYPT5_TIMEOUT_MS = 10_000;

@Controller()
export class RootController {
    private readonly logger = new Logger(RootController.name);

    constructor(
        private readonly rootService: RootService,
        private readonly subpageConfigService: SubpageConfigService,
        private readonly axiosService: AxiosService,
    ) {}

    @Get(APP_CONFIG_ROUTE_WO_LEADING_PATH)
    async getSubscriptionPageConfig(@GetJWTPayload() user: IJwtPayload, @Req() request: Request) {
        return await this.subpageConfigService.getSubscriptionPageConfig(user.su, request);
    }

    @Post(':shortUuid/happ-crypt5')
    async createHappCrypt5Link(
        @ClientIp() clientIp: string,
        @Param('shortUuid') shortUuid: string,
        @Req() request: Request,
        @Body('url') url: unknown,
    ) {
        if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
            throw new BadRequestException('Invalid subscription URL');
        }

        const subscriptionUrl = new URL(url);
        const expectedHost = request.get('host');
        const forwardedProto = request.get('x-forwarded-proto')?.split(',')[0]?.trim();
        const expectedProtocol = forwardedProto || request.protocol;
        const expectedOrigin = expectedHost ? `${expectedProtocol}://${expectedHost}` : undefined;
        const lastPathSegment = subscriptionUrl.pathname.split('/').filter(Boolean).at(-1);

        if (!expectedOrigin || subscriptionUrl.origin !== expectedOrigin) {
            throw new BadRequestException('Subscription URL origin mismatch');
        }

        if (lastPathSegment !== shortUuid) {
            throw new BadRequestException('Subscription URL short UUID mismatch');
        }

        const subscriptionInfo = await this.axiosService.getSubscriptionInfo(clientIp, shortUuid);

        if (!subscriptionInfo.isOk || !subscriptionInfo.response) {
            throw new BadRequestException('Subscription not found');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), HAPP_CRYPT5_TIMEOUT_MS);

        let response: globalThis.Response;

        try {
            response = await fetch(HAPP_CRYPT5_API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
                    'Content-Type': 'application/json',
                    'User-Agent': 'remnawave-subscription-page/1.0',
                },
                body: JSON.stringify({ url }),
                signal: controller.signal,
            });
        } catch (error) {
            this.logger.warn(
                error instanceof Error
                    ? `Happ crypt5 API request failed: ${error.message}`
                    : 'Happ crypt5 API request failed',
            );
            throw new BadGatewayException('Happ crypt5 API request failed');
        } finally {
            clearTimeout(timeout);
        }

        const rawResponse = await response.text();

        if (!response.ok) {
            this.logger.warn(
                `Happ crypt5 API responded with ${response.status}: ${rawResponse.slice(0, 300)}`,
            );
            throw new BadGatewayException('Happ crypt5 API request failed');
        }

        let link: unknown = rawResponse.trim();
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            try {
                const data: unknown = JSON.parse(rawResponse);

                if (typeof data === 'string') {
                    link = data;
                } else if (data && typeof data === 'object') {
                    const payload = data as Record<string, unknown>;
                    link = payload.encrypted_link ?? payload.url ?? payload.link ?? payload.result;
                }
            } catch {
                link = rawResponse.trim();
            }
        }

        if (typeof link !== 'string' || !link.startsWith('happ://crypt5/')) {
            this.logger.warn(`Happ crypt5 API returned an invalid link: ${rawResponse.slice(0, 300)}`);
            throw new BadGatewayException('Happ crypt5 API returned an invalid link');
        }

        return { link };
    }

    @Get([':shortUuid', ':shortUuid/:clientType'])
    async root(
        @ClientIp() clientIp: string,
        @Req() request: Request,
        @Res() response: ExpressResponse,
        @Param('shortUuid') shortUuid: string,
        @Param('clientType') clientType: string,
    ) {
        if (request.path.startsWith('/assets') || request.path.startsWith('/locales')) {
            response.socket?.destroy();
            return;
        }

        if (clientType === undefined) {
            return await this.rootService.serveSubscriptionPage(
                clientIp,
                request,
                response,
                shortUuid,
            );
        }

        if (!REQUEST_TEMPLATE_TYPE_VALUES.includes(clientType as TRequestTemplateTypeKeys)) {
            this.logger.error(`Invalid client type: ${clientType}`);

            response.socket?.destroy();
            return;
        } else {
            return await this.rootService.serveSubscriptionPage(
                clientIp,
                request,
                response,
                shortUuid,
                clientType as TRequestTemplateTypeKeys,
            );
        }
    }
}
