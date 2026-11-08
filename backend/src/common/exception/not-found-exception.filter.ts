import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';

import { rejectRequest } from '@common/utils/reject-request';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        rejectRequest(response, 404);

        return;
    }
}
