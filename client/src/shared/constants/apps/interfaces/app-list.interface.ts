export interface IAppList {
    downloadPCLinks?: {
        linux?: string
        macos?: string
        windows?: string
    }
    downloadUrl?: string
    id: `${Lowercase<string>}-${Lowercase<'android' | 'ios' | 'pc'>}`
    isFeatured: boolean
    isNeedBase64Encoding?: boolean
    name: string
    platform: 'android' | 'ios' | 'pc'
    urlScheme: string
    viewPosition: number
}
