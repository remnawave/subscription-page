import { table } from 'table';
import { getAppVersion } from './get-app-version';

export async function getStartMessage() {
    const appVersion = await getAppVersion();

    return table([['Docs → https://docs.rw\nCommunity → https://t.me/remnawave']], {
        header: {
            content: `Remnawave Subscription Page v${appVersion}`,
            alignment: 'center',
        },
        columnDefault: {
            width: 60,
        },
        columns: {
            0: { alignment: 'center' },
            1: { alignment: 'center' },
        },
        drawVerticalLine: () => false,
    });
}
