import { Request, Response, NextFunction } from 'express';

import { IGNORED_HEADERS } from '@common/constants';
import { rejectRequest } from '@common/utils/reject-request';

export function headerFilterMiddleware(req: Request, res: Response, next: NextFunction) {
    for (const key of Object.keys(req.headers)) {
        if (IGNORED_HEADERS.has(key)) {
            delete req.headers[key];
        }
    }

    if (!req.headers['user-agent']) {
        rejectRequest(res, 400);
        return;
    }

    next();
}
