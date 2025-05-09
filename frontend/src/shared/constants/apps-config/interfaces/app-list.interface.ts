export interface IAppConfig {
    id: `${Lowercase<string>}`
    name: string
    isFeatured: boolean
    isNeedBase64Encoding?: boolean
    urlScheme: string
    installationStep: {
        buttons: {
            buttonLink: string
            buttonText: {
                en: string
                fa: string
                ru: string
            }
        }[]
        description: {
            en: string
            fa: string
            ru: string
        }
    }
    addSubscriptionStep: {
        description: {
            en: string
            fa: string
            ru: string
        }
    }
    connectAndUseStep: {
        description: {
            en: string
            fa: string
            ru: string
        }
    }
    additionalBeforeAddSubscriptionStep?: {
        buttons: {
            buttonLink: string
            buttonText: {
                en: string
                fa: string
                ru: string
            }
        }[]
        description: {
            en: string
            fa: string
            ru: string
        }
        title: {
            en: string
            fa: string
            ru: string
        }
    }
    additionalAfterAddSubscriptionStep?: {
        buttons: {
            buttonLink: string
            buttonText: {
                en: string
                fa: string
                ru: string
            }
        }[]
        description: {
            en: string
            fa: string
            ru: string
        }
        title: {
            en: string
            fa: string
            ru: string
        }
    }
}

export interface IPlatformConfig {
    ios: IAppConfig[]
    android: IAppConfig[]
    pc: IAppConfig[]
}
