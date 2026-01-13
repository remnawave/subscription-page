export const IGNORED_HEADERS = new Set([
    'accept-encoding',
    'authorization',
    'cache-control',
    'cf-access-client-id',
    'cf-access-client-secret',
    'connection',
    'content-length',
    'content-security-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',

    'expires',
    'host',
    'keep-alive',

    'pragma',
    'proxy-authenticate',
    'proxy-authorization',

    'te',
    'trailer',
    'transfer-encoding',

    'upgrade',
    'x-api-key',
    'x-forwarded-for',
    'x-forwarded-proto',
    'x-forwarded-scheme',
]);
