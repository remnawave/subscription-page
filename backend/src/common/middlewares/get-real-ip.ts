import { NextFunction, Request, Response } from 'express';
import { getClientIp } from '@supercharge/request-ip';
import morgan from 'morgan';

morgan.token('remote-addr', (req: Request) => {
    return getClientIp(req) || '0.0.0.0';
});

export const getRealIp = function (req: Request, res: Response, next: NextFunction) {
    next();
};
