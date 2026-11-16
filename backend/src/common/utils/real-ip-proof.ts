import { createHmac } from 'node:crypto';

const PROOF_CONTEXT = 'remnawave-real-ip:v1';

export type TRealIpProofSigner = (ip: string) => string;

export function createRealIpProofSigner(apiToken: string): null | TRealIpProofSigner {
    const parts = apiToken.trim().split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const key = Buffer.from(signature, 'base64url');
    if (key.length === 0) return null;

    return (ip) => {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const mac = createHmac('sha256', key)
            .update(`${PROOF_CONTEXT}|${ip}|${timestamp}`)
            .digest('base64url');

        return `${header}.${payload}.${timestamp}.${mac}`;
    };
}
