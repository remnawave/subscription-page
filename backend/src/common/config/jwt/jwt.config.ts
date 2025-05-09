import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
    useFactory: () => ({
        secret: process.env.INTERNAL_JWT_SECRET,
    }),
});
