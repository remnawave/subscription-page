import { Response } from 'express';

/**
 * Rejects a request. By default the socket is closed without any response.
 * With DROP_REJECTED_REQUESTS=false a plain HTTP status is sent instead.
 */
export function rejectRequest(res: Response, statusCode: number): void {
    if (process.env.DROP_REJECTED_REQUESTS === 'false' && !res.headersSent) {
        res.sendStatus(statusCode);
        return;
    }

    res.socket?.destroy();
}
