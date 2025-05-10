import {
    IAppConfig,
    IPlatformConfig
} from '@shared/constants/apps-config/interfaces/app-list.interface'

export interface IPlatformGuideProps {
    getAppsForPlatform: (platform: 'android' | 'ios' | 'pc') => IAppConfig[]
    getSelectedAppForPlatform: (platform: 'android' | 'ios' | 'pc') => IAppConfig | null
    openDeepLink: (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => void
    appsConfig: IPlatformConfig
}
