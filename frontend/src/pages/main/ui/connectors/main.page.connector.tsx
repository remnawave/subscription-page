import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { ofetch } from 'ofetch'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { LoadingScreen } from '@shared/ui'

import { MainPageComponent } from '../components/main.page.component'
import { useMediaQuery } from '@mantine/hooks'
import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'

export const MainPageConnector = () => {
    const { subscription } = useSubscriptionInfoStoreInfo()
    const [appsConfig, setAppsConfig] = useState<TSubscriptionPageRawConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isMobile = useMediaQuery(`(max-width: 30rem)`, undefined, {
        getInitialValueInEffect: false
    })

    const [isMediaQueryReady, setIsMediaQueryReady] = useState(false)

    useEffect(() => {
        setIsMediaQueryReady(true)
    }, [isMobile])

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const tempConfig = await ofetch<TSubscriptionPageRawConfig>(
                    `/assets/app-config-v2.json?v=${Date.now()}`,
                    {
                        parseResponse: (response) => JSON.parse(response)
                    }
                )

                setAppsConfig(tempConfig)
            } catch (error) {
                consola.error('Failed to fetch app config:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchConfig()
    }, [])

    if (isLoading || !subscription || !appsConfig || !isMediaQueryReady)
        return <LoadingScreen height="100vh" />

    return <MainPageComponent appConfig={appsConfig} isMobile={isMobile} />
}
