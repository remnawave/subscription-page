import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIp = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const ip = request.headers['cf-connecting-ip'] as string;

    return Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();
});
