import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/nprogress/styles.layer.css'
import '@gfazioli/mantine-spinner/styles.css'

import './global.css'

import { DirectionProvider, MantineProvider } from '@mantine/core'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { NavigationProgress } from '@mantine/nprogress'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import { enableMainThreadBlocking } from 'ios-vibrator-pro-max'
import { theme } from '@shared/constants'
import { Router } from './app/router/router'

dayjs.extend(customParseFormat)

polyfillCountryFlagEmojis()

enableMainThreadBlocking(false)

export function App() {
    const mq = useMediaQuery('(min-width: 40em)')

    return (
        <DirectionProvider>
            <MantineProvider defaultColorScheme="dark" theme={theme}>
                <ModalsProvider>
                    <Notifications position={mq ? 'top-right' : 'bottom-right'} />
                    <NavigationProgress />

                    <Router />
                </ModalsProvider>
            </MantineProvider>
        </DirectionProvider>
    )
}
