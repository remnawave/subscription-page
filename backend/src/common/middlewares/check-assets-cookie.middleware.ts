import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { Logger } from '@nestjs/common';

import { IJwtPayload } from '@common/constants';
import { rejectRequest } from '@common/utils/reject-request';

const logger = new Logger('CheckAssetsCookieMiddleware');

export function checkAssetsCookieMiddleware(
    req: { user: IJwtPayload } & Request,
    res: Response,
    next: NextFunction,
) {
    const secret = process.env.INTERNAL_JWT_SECRET;

    if (!secret) {
        logger.error('INTERNAL_JWT_SECRET is not set');
        rejectRequest(res, 500);

        return;
    }

    if (!req.cookies.session) {
        logger.debug('No session cookie found');
        rejectRequest(res, 403);

        return;
    }

    try {
        const jwtPayload = jwt.verify(req.cookies.session, secret);

        req.user = jwtPayload as unknown as IJwtPayload;
    } catch (error) {
        logger.debug(error);
        rejectRequest(res, 403);

        return;
    }

    return next();
}
