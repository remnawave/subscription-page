import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIp = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.clientIp;
});
