import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'
import { Outlet } from 'react-router-dom'
import { useLayoutEffect } from 'react'

import { useSubscriptionInfoStoreActions } from '@entities/subscription-info-store/subscription-info-store'

import classes from './root.module.css'

export function RootLayout() {
    const actions = useSubscriptionInfoStoreActions()

    useLayoutEffect(() => {
        const rootDiv = document.getElementById('root')

        if (rootDiv) {
            const subscriptionUrl = rootDiv.dataset.panel

            if (subscriptionUrl) {
                const subscription: GetSubscriptionInfoByShortUuidCommand.Response['response'] =
                    JSON.parse(atob(subscriptionUrl))

                actions.setSubscriptionInfo({
                    subscription
                })
            }
        }
    }, [])

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
