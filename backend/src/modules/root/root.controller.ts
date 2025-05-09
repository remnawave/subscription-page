import { Request, Response } from 'express';

import { Get, Controller, Res, Req, Param, Logger } from '@nestjs/common';

import {
    REQUEST_TEMPLATE_TYPE_VALUES,
    TRequestTemplateTypeKeys,
} from '@remnawave/backend-contract';

import { RootService } from './root.service';

@Controller()
export class RootController {
    private readonly logger = new Logger(RootController.name);

    constructor(private readonly rootService: RootService) {}
    @Get([':shortUuid', ':shortUuid/:clientType'])
    async root(
        @Req() request: Request,
        @Res() response: Response,
        @Param('shortUuid') shortUuid: string,
        @Param('clientType') clientType: string,
    ) {
        if (clientType === undefined) {
            return await this.rootService.serveSubscriptionPage(request, response, shortUuid);
        }

        if (!REQUEST_TEMPLATE_TYPE_VALUES.includes(clientType as TRequestTemplateTypeKeys)) {
            this.logger.error(`Invalid client type: ${clientType}`);

            response.socket?.destroy();
            return;
        } else {
            return await this.rootService.serveSubscriptionPage(
                request,
                response,
                shortUuid,
                clientType as TRequestTemplateTypeKeys,
            );
        }
    }
}
