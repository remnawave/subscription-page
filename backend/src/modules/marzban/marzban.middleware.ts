import { Request, Response, NextFunction } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { rejectRequest } from '@common/utils/reject-request';

import { MarzbanService } from './marzban.service';

@Injectable()
export class MarzbanMiddleware implements NestMiddleware {
    constructor(private readonly marzbanService: MarzbanService) {}
    async use(
        req: { clientIp: string; resolvedShortUuid?: string | null } & Request,
        res: Response,
        next: NextFunction,
    ) {
        const marzbanShortUuid = req.params.shortUuid;

        const resolvedShortUuid = await this.marzbanService.resolveShortUuid(
            marzbanShortUuid,
            req.clientIp,
        );

        if (resolvedShortUuid.dropConnection) {
            rejectRequest(res, resolvedShortUuid.panelUnavailable ? 502 : 404);
            return;
        }

        if (resolvedShortUuid.shortUuid) {
            req.resolvedShortUuid = resolvedShortUuid.shortUuid;
        }

        next();
    }
}
