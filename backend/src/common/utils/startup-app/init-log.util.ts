import { LogLevel } from '@nestjs/common';

import { isDevelopment } from './is-development';

export function initLogs(): LogLevel[] {
    const logLevels: LogLevel[] = isDevelopment()
        ? ['log', 'error', 'warn', 'debug', 'verbose']
        : ['log', 'error', 'warn'];

    return logLevels;
}
