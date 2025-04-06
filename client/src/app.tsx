import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/nprogress/styles.layer.css'

import './global.css'

import { Center, DirectionProvider, MantineProvider } from '@mantine/core'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { NavigationProgress } from '@mantine/nprogress'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { I18nextProvider } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { Suspense } from 'react'
import dayjs from 'dayjs'

import { LoadingScreen } from '@shared/ui/loading-screen'
import { theme } from '@shared/constants'

import { Router } from './app/router/router'
import i18n from './app/i18n/i18n'

dayjs.extend(customParseFormat)

polyfillCountryFlagEmojis()

export function App() {
    const mq = useMediaQuery('(min-width: 40em)')

    return (
        <I18nextProvider defaultNS={'main'} i18n={i18n}>
            <DirectionProvider>
                <MantineProvider defaultColorScheme="dark" theme={theme}>
                    <ModalsProvider>
                        <Notifications position={mq ? 'top-right' : 'bottom-right'} />
                        <NavigationProgress />
                        <Suspense
                            fallback={
                                <Center h={'100%'}>
                                    <LoadingScreen height="60vh" />
                                </Center>
                            }
                        >
                            <Router />
                        </Suspense>
                    </ModalsProvider>
                </MantineProvider>
            </DirectionProvider>
        </I18nextProvider>
    )
}
