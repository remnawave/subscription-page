import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const sourcePath = process.argv[2]
const outputPath = process.argv[3] ?? 'config/yung-link.subpage.json'

if (!sourcePath) {
    throw new Error('Usage: node tools/build-yung-link-config.mjs <base-row-or-config.json> [output.json]')
}

const source = JSON.parse(await readFile(resolve(sourcePath), 'utf8'))
const base = source.config ?? source
const localized = (ru, en) => ({ ru, en })
const external = (link, ru, en) => ({
    link,
    type: 'external',
    text: localized(ru, en),
    svgIconKey: 'ExternalLink'
})
const subscriptionLink = (scheme) => ({
    link: scheme,
    type: 'subscriptionLink',
    text: localized('Добавить подписку', 'Add subscription'),
    svgIconKey: 'Plus'
})
const block = (titleRu, titleEn, descriptionRu, descriptionEn, buttons, icon, color) => ({
    title: localized(titleRu, titleEn),
    buttons,
    svgIconKey: icon,
    description: localized(descriptionRu, descriptionEn),
    svgIconColor: color
})

const installBlock = (buttons) =>
    block(
        'Установите приложение',
        'Install the app',
        'Выберите официальный источник и установите VPN-клиент.',
        'Choose an official source and install the VPN client.',
        buttons,
        'DownloadIcon',
        'gray'
    )
const importBlock = (scheme) =>
    block(
        'Добавьте подписку',
        'Add the subscription',
        'Нажмите кнопку, чтобы передать ссылку приложению.',
        'Use the button to pass your subscription link to the app.',
        [subscriptionLink(scheme)],
        'CloudDownload',
        'gray'
    )
const connectBlock = () =>
    block(
        'Подключитесь',
        'Connect',
        'Откройте список серверов, выберите профиль и включите VPN.',
        'Open the server list, choose a profile and turn on the VPN.',
        [],
        'Check',
        'gray'
    )
const makeApp = (name, featured, installButtons, scheme) => ({
    name,
    featured,
    blocks: [installBlock(installButtons), importBlock(scheme), connectBlock()]
})

const links = {
    happ: {
        android: [
            external(
                'https://play.google.com/store/apps/details?id=com.happproxy',
                'Google Play',
                'Google Play'
            ),
            external(
                'https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk',
                'Скачать APK',
                'Download APK'
            )
        ],
        apple: [
            external(
                'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215',
                'App Store',
                'App Store'
            )
        ],
        appleTv: [
            external(
                'https://apps.apple.com/us/app/happ-proxy-utility-for-tv/id6748297274',
                'App Store',
                'App Store'
            )
        ],
        windows: [
            external(
                'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe',
                'Скачать для Windows',
                'Download for Windows'
            )
        ],
        linux: [
            external(
                'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.deb',
                'Скачать .deb',
                'Download .deb'
            ),
            external(
                'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.rpm',
                'Скачать .rpm',
                'Download .rpm'
            ),
            external(
                'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.pkg.tar.zst',
                'Скачать .pkg',
                'Download .pkg'
            ),
            external(
                'https://github.com/Happ-proxy/happ-desktop/releases',
                'Все релизы',
                'All releases'
            )
        ]
    },
    v2rayTun: {
        android: [
            external(
                'https://play.google.com/store/apps/details?id=com.v2raytun.android',
                'Google Play',
                'Google Play'
            ),
            external(
                'https://github.com/DigneZzZ/v2raytun/releases',
                'Релизы GitHub',
                'GitHub releases'
            )
        ],
        apple: [
            external(
                'https://apps.apple.com/us/app/v2raytun/id6476628951',
                'App Store',
                'App Store'
            )
        ],
        windows: [
            external(
                'https://github.com/DigneZzZ/v2raytun/releases',
                'Скачать для Windows',
                'Download for Windows'
            )
        ]
    }
}

const happ = (installButtons) =>
    makeApp('Happ', true, installButtons, 'happ://add/{{SUBSCRIPTION_LINK}}')
const v2rayTun = (installButtons) =>
    makeApp('V2RayTun', false, installButtons, 'v2raytun://import/{{SUBSCRIPTION_LINK}}')
const platform = (key, ru, en, apps) => ({
    displayName: localized(ru, en),
    svgIconKey: base.platforms[key].svgIconKey,
    apps
})

const config = {
    version: '1',
    locales: ['ru', 'en'],
    baseSettings: {
        metaTitle: 'Yung Link',
        metaDescription: 'Подписка Yung Link',
        hideGetLinkButton: false,
        showConnectionKeys: false
    },
    brandingSettings: {
        title: 'Yung Link',
        logoUrl: '/assets/yung-link-logo.svg',
        supportUrl: 'https://t.me/skyy3'
    },
    uiConfig: {
        subscriptionInfoBlockType: 'cards',
        installationGuidesBlockType: 'cards'
    },
    baseTranslations: base.baseTranslations,
    svgLibrary: base.svgLibrary,
    platforms: {
        android: platform('android', 'Android', 'Android', [
            happ(links.happ.android),
            v2rayTun(links.v2rayTun.android)
        ]),
        androidTV: platform('androidTV', 'Android TV', 'Android TV', [
            happ(links.happ.android),
            v2rayTun(links.v2rayTun.android)
        ]),
        ios: platform('ios', 'iOS и iPadOS', 'iOS and iPadOS', [
            happ(links.happ.apple),
            v2rayTun(links.v2rayTun.apple)
        ]),
        macos: platform('macos', 'macOS', 'macOS', [
            happ(links.happ.apple),
            v2rayTun(links.v2rayTun.apple)
        ]),
        windows: platform('windows', 'Windows', 'Windows', [
            happ(links.happ.windows),
            v2rayTun(links.v2rayTun.windows)
        ]),
        appleTV: platform('appleTV', 'Apple TV', 'Apple TV', [happ(links.happ.appleTv)]),
        linux: platform('linux', 'Linux', 'Linux', [happ(links.happ.linux)])
    }
}

const destination = resolve(outputPath)
await mkdir(dirname(destination), { recursive: true })
await writeFile(destination, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
console.log(destination)
