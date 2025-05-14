import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import cookieParser from 'cookie-parser';
import { createLogger } from 'winston';
import compression from 'compression';
import * as winston from 'winston';
import { nanoid } from 'nanoid';
import { json } from 'express';
import path from 'node:path';
import helmet from 'helmet';
import morgan from 'morgan';

import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { checkAssetsCookieMiddleware } from '@common/middlewares/check-assets-cookie.middleware';
import { NotFoundExceptionFilter } from '@common/exception/not-found-exception.filter';
import { isDevelopment, isDevOrDebugLogsEnabled } from '@common/utils/startup-app';
import { getStartMessage } from '@common/utils/startup-app/get-start-message';
import { customLogFilter } from '@common/utils/filter-logs/filter-logs';
import { getRealIp } from '@common/middlewares/get-real-ip';
import { proxyCheckMiddleware } from '@common/middlewares';

import { AppModule } from './app.module';

// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6,
// };

process.env.INTERNAL_JWT_SECRET = nanoid(64);

const instanceId = process.env.INSTANCE_ID || '0';

const logger = createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        customLogFilter(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(`#${instanceId}`, {
            colors: true,
            prettyPrint: true,
            processId: false,
            appName: true,
        }),
    ),
    level: isDevOrDebugLogsEnabled() ? 'debug' : 'http',
});

const assetsPath = isDevelopment()
    ? path.join(__dirname, '..', '..', 'dev_frontend')
    : '/opt/app/frontend';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    });

    app.use(cookieParser());

    app.use(proxyCheckMiddleware, checkAssetsCookieMiddleware);

    app.useGlobalFilters(new NotFoundExceptionFilter());

    app.useStaticAssets(assetsPath, {
        index: false,
    });

    app.setBaseViewsDir(assetsPath);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const consolidate = require('@ladjs/consolidate');

    app.engine('html', consolidate.ejs);
    app.setViewEngine('html');

    app.use(json({ limit: '100mb' }));

    const config = app.get(ConfigService);

    app.use(helmet({ contentSecurityPolicy: false }));

    app.use(compression());

    app.use(getRealIp);

    app.use(
        morgan(
            ':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
        ),
    );

    app.setGlobalPrefix(config.get<string>('CUSTOM_SUB_PREFIX') || '');

    app.enableCors({
        origin: '*',
        methods: 'GET',
        credentials: false,
    });

    app.enableShutdownHooks();

    await app.listen(Number(config.getOrThrow<string>('APP_PORT')));

    logger.info('\n' + (await getStartMessage()) + '\n');
}
void bootstrap();
