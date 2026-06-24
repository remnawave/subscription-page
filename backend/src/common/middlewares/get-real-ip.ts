import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

morgan.token('remote-addr', (req: { clientIp: string } & Request) => {
    return req.clientIp;
});

export const getRealIp = function (
    req: { clientIp: string } & Request,
    res: Response,
    next: NextFunction,
) {
    const raw = req.ip || req.socket.remoteAddress || '0.0.0.0';
    req.clientIp = raw.startsWith('::ffff:') ? raw.slice(7) : raw;

    next();
};
