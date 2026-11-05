import { Request, Response } from 'express';

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { TRequestTemplateTypeKeys } from '@remnawave/backend-contract';

import { AxiosService } from '@common/axios/axios.service';
import { rejectRequest } from '@common/utils/reject-request';

@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(private readonly axiosService: AxiosService) {}

    public async serveSubscriptionPage(
        clientIp: string,
        req: Request,
        res: Response,
        shortUuid: string,
        clientType?: TRequestTemplateTypeKeys,
    ): Promise<void> {
        try {
            const subscriptionDataResponse = await this.axiosService.getSubscription(
                clientIp,
                shortUuid,
                req.headers,
                !!clientType,
                clientType,
            );

            if (!subscriptionDataResponse) {
                rejectRequest(res, 404);
                return;
            }

            if (subscriptionDataResponse.headers) {
                res.set(subscriptionDataResponse.headers);
            }

            res.status(200).send(subscriptionDataResponse.subscription);
            return;
        } catch (error) {
            this.logger.error('Error in serveSubscriptionPage', error);

            rejectRequest(res, 500);
            return;
        }
    }
}
