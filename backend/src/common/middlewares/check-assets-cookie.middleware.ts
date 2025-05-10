import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { Logger } from '@nestjs/common';

const logger = new Logger('CheckAssetsCookieMiddleware');

export function checkAssetsCookieMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/assets') || req.path.startsWith('/locales')) {
        const secret = process.env.INTERNAL_JWT_SECRET;

        if (!secret) {
            logger.error('INTERNAL_JWT_SECRET is not set');
            res.socket?.destroy();

            return;
        }

        if (!req.cookies.session) {
            logger.debug('No session cookie found');
            res.socket?.destroy();

            return;
        }

        try {
            jwt.verify(req.cookies.session, secret);
        } catch (error) {
            logger.debug(error);
            res.socket?.destroy();

            return;
        }
    }

    return next();
}
