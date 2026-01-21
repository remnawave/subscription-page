export const IGNORED_HEADERS = new Set([
    'accept-encoding',
    'alt-svc',
    'authorization',
    'cache-control',
    'cf-access-client-id',
    'cf-access-client-secret',
    'cf-cache-status',
    'cf-ray',
    'connection',
    'content-length',

    'content-security-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',

    'expires',
    'host',
    'keep-alive',
    'nel',
    'origin-agent-cluster',
    'pragma',

    'proxy-authenticate',

    'proxy-authorization',
    'report-to',
    'server',
    'te',

    'trailer',
    'transfer-encoding',
    'upgrade',
    'x-api-key',
    'x-forwarded-for',

    'x-forwarded-proto',
    'x-forwarded-scheme',
]);
