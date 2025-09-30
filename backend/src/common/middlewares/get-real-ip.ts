import { NextFunction, Request, Response } from 'express';
import { getClientIp } from '@kastov/request-ip';
import morgan from 'morgan';

morgan.token('remote-addr', (req: { clientIp: string } & Request) => {
    return req.clientIp;
});

export const getRealIp = function (
    req: { clientIp: string } & Request,
    res: Response,
    next: NextFunction,
) {
    const ip = getClientIp(req);
    if (ip) {
        req.clientIp = ip;
    } else {
        req.clientIp = '0.0.0.0';
    }

    next();
};
