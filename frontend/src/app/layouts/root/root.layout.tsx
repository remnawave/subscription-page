import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import consola from 'consola/browser'

import { useSubscriptionInfoStoreActions } from '@entities/subscription-info-store/subscription-info-store'
import { LoadingScreen } from '@shared/ui/loading-screen/loading-screen'

import classes from './root.module.css'
import i18n from '../../i18n/i18n'
import { Box } from '@mantine/core'
import { AnimatedBackground } from '@shared/ui'

export function RootLayout() {
    const actions = useSubscriptionInfoStoreActions()
    const [i18nInitialized, setI18nInitialized] = useState(i18n.isInitialized)

    useLayoutEffect(() => {
        const rootDiv = document.getElementById('root')

        if (rootDiv) {
            const subscriptionUrl = rootDiv.dataset.panel

            if (subscriptionUrl) {
                try {
                    const subscription: GetSubscriptionInfoByShortUuidCommand.Response = JSON.parse(
                        atob(subscriptionUrl)
                    )

                    actions.setSubscriptionInfo({
                        subscription: subscription.response
                    })
                } catch (error) {
                    consola.log(error)
                } finally {
                    delete rootDiv.dataset.panel
                }
            }
        }
    }, [])

    useEffect(() => {
        if (!i18nInitialized) {
            i18n.on('initialized', () => {
                setI18nInitialized(true)
            })
        }
    }, [i18nInitialized])

    if (!i18nInitialized) {
        return <LoadingScreen height="100vh" />
    }

    return (
        <div className={classes.root}>
            <AnimatedBackground />
            <div className={classes.content}>
                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
