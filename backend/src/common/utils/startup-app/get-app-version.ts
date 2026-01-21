import { readPackageJSON } from 'pkg-types';

let cachedVersion: string | undefined;

export async function getAppVersion(): Promise<string> {
    if (cachedVersion) {
        return cachedVersion;
    }

    const pkg = await readPackageJSON();
    cachedVersion = pkg.version ?? 'unknown';
    return cachedVersion;
}

