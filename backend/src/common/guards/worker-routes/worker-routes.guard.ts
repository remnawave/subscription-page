import { Observable } from 'rxjs';
import { Request } from 'express';

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class WorkerRoutesGuard implements CanActivate {
    constructor(private readonly options: { allowedPaths: string[] } = { allowedPaths: [] }) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        if (this.options.allowedPaths.includes(request.path)) {
            return true;
        }

        const response = context.switchToHttp().getResponse();
        response.socket?.destroy();

        return false;
    }
}
