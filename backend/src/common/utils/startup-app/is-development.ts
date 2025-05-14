export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export function isDebugLogsEnabled(): boolean {
    return process.env.ENABLE_DEBUG_LOGS === 'true';
}

export function isDevOrDebugLogsEnabled(): boolean {
    if (isDevelopment()) {
        return true;
    }

    if (isDebugLogsEnabled()) {
        return true;
    }

    return false;
}
