import { NextFunction, Request, Response } from 'express';

import { Logger } from '@nestjs/common';

import { rejectRequest } from '@common/utils/reject-request';

const logger = new Logger('ProxyCheckMiddleware');

export function proxyCheckMiddleware(req: Request, res: Response, next: NextFunction) {
    const isProxy = Boolean(req.headers['x-forwarded-for']);
    const isHttps = Boolean(req.headers['x-forwarded-proto'] === 'https');

    if (!isHttps || !isProxy) {
        logger.debug(
            `X-Forwarded-For: ${req.headers['x-forwarded-for']}, X-Forwarded-Proto: ${req.headers['x-forwarded-proto']}`,
        );

        rejectRequest(res, 403);
        logger.error('Reverse proxy and HTTPS are required.');
        return;
    }

    return next();
}
