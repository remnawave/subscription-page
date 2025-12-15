import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { ofetch } from 'ofetch'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { LoadingScreen } from '@shared/ui'

import { MainPageComponent } from '../components/main.page.component'
import { useMediaQuery } from '@mantine/hooks'
import {
    APP_CONFIG_ROUTE_LEADING_PATH,
    SubscriptionPageRawConfigSchema,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'

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
                const tempConfig = await ofetch<unknown>(
                    `${APP_CONFIG_ROUTE_LEADING_PATH}?v=${Date.now()}`,
                    {
                        parseResponse: (response) => JSON.parse(response)
                    }
                )

                const parsedConfig =
                    await SubscriptionPageRawConfigSchema.safeParseAsync(tempConfig)

                if (!parsedConfig.success) {
                    consola.error('Failed to parse app config:', parsedConfig.error)
                    return
                }

                const config = parsedConfig.data

                setAppsConfig(config)
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
