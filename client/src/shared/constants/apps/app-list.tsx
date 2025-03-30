import { IAppList } from './interfaces/app-list.interface'

export const appList: IAppList[] = [
    {
        id: 'happ-ios',
        name: 'Happ',
        platform: 'ios',
        urlScheme: 'happ://add/',
        downloadUrl: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215',
        isFeatured: true,
        viewPosition: 1
    },
    {
        id: 'streisand-ios',
        name: 'Streisand',
        platform: 'ios',
        urlScheme: 'streisand://import/',
        downloadUrl: 'https://apps.apple.com/ru/app/streisand/id6450534064',
        isFeatured: false,
        isNeedBase64Encoding: true,
        viewPosition: 2
    },
    {
        id: 'shadowrocket-ios',
        name: 'Shadowrocket',
        platform: 'ios',
        urlScheme: 'sub://',
        downloadUrl: 'https://apps.apple.com/ru/app/shadowrocket/id932747118',
        isFeatured: false,
        isNeedBase64Encoding: true,
        viewPosition: 3
    },
    {
        id: 'happ-android',
        name: 'Happ',
        platform: 'android',
        urlScheme: 'happ://add/',
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.happproxy',
        isFeatured: true,
        viewPosition: 1
    },
    {
        id: 'clash-meta-android',
        name: 'Clash Meta',
        platform: 'android',
        urlScheme: 'clash://install-config?url=',
        downloadUrl:
            'https://github.com/MetaCubeX/ClashMetaForAndroid/releases/download/v2.11.7/cmfa-2.11.7-meta-universal-release.apk',
        isFeatured: false,
        viewPosition: 2
    },
    {
        id: 'hiddify-pc',
        name: 'Hiddify',
        platform: 'pc',
        urlScheme: 'hiddify://import/',
        downloadPCLinks: {
            windows:
                'https://github.com/hiddify/hiddify-app/releases/download/v2.5.7/Hiddify-Windows-Setup-x64.exe',
            macos: 'https://github.com/hiddify/hiddify-app/releases/download/v2.5.7/Hiddify-MacOS.dmg',
            linux: 'https://github.com/hiddify/hiddify-app/releases/download/v2.5.7/Hiddify-Linux-x64.AppImage'
        },
        isFeatured: true,
        viewPosition: 2
    }
]
