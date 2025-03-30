import { IAppList } from '@shared/constants/apps/interfaces/app-list.interface'

export interface IPlatformGuideProps {
    getAppsForPlatform: (platform: 'android' | 'ios' | 'pc') => IAppList[]
    getSelectedAppForPlatform: (platform: 'android' | 'ios' | 'pc') => IAppList | null
    openDeepLink: (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => void
}
