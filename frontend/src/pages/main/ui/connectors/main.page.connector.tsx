import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { ofetch } from 'ofetch'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { ISubscriptionPageAppConfig } from '@shared/constants/apps-config'
import { LoadingScreen } from '@shared/ui'

import { MainPageComponent } from '../components/main.page.component'

export const MainPageConnector = () => {
    const { subscription } = useSubscriptionInfoStoreInfo()
    const [appsConfig, setAppsConfig] = useState<ISubscriptionPageAppConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await ofetch<ISubscriptionPageAppConfig>(
                    `/assets/app-config.json?v=${Date.now()}`,
                    {
                        parseResponse: JSON.parse
                    }
                )
                setAppsConfig(config)
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
