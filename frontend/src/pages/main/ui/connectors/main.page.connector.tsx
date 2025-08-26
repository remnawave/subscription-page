import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { ofetch } from 'ofetch'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { ISubscriptionPageAppConfig } from '@shared/constants/apps-config'
import { isOldFormat } from '@shared/utils/migration.utils'
import { LoadingScreen } from '@shared/ui'

import { MainPageComponent } from '../components/main.page.component'

export const MainPageConnector = () => {
    const { subscription } = useSubscriptionInfoStoreInfo()
    const [appsConfig, setAppsConfig] = useState<ISubscriptionPageAppConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const tempConfig = await ofetch<ISubscriptionPageAppConfig>(
                    `/assets/app-config.json?v=${Date.now()}`,
                    {
                        parseResponse: JSON.parse
                    }
                )

                let newConfig: ISubscriptionPageAppConfig | null = null

                if (isOldFormat(tempConfig)) {
                    consola.warn('Old config format detected, migrating to new format...')
                    newConfig = {
                        config: {
                            additionalLocales: ['ru', 'fa', 'zh', 'fr']
                        },
                        platforms: {
                            ios: tempConfig.ios,
                            android: tempConfig.android,
                            windows: tempConfig.pc,
                            macos: tempConfig.pc,
                            linux: [],
                            androidTV: [],
                            appleTV: []
                        }
                    }
                } else {
                    newConfig = tempConfig
                }

                setAppsConfig(newConfig)
            } catch (error) {
                consola.error('Failed to fetch app config:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchConfig()
    }, [])

    if (isLoading || !subscription || !appsConfig) return <LoadingScreen height="100vh" />

    return <MainPageComponent subscriptionPageAppConfig={appsConfig} />
}
