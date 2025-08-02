import { Center, Container, Group, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import {
    ISubscriptionPageAppConfig,
    TEnabledLocales
} from '@shared/constants/apps-config/interfaces/app-list.interface'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'

import { InstallationGuideWidget } from '../../../../widgets/main/installation-guide/installation-guide.widget'
import { SubscriptionLinkWidget } from '../../../../widgets/main/subscription-link/subscription-link.widget'
import { SubscriptionInfoWidget } from '../../../../widgets/main/subscription-info/subscription-info.widget'

export const MainPageComponent = ({
    subscriptionPageAppConfig
}: {
    subscriptionPageAppConfig: ISubscriptionPageAppConfig
}) => {
    const { t } = useTranslation()

    let additionalLocales: TEnabledLocales[] = ['en', 'ru', 'fa', 'zh']

    if (subscriptionPageAppConfig.config.additionalLocales !== undefined) {
        additionalLocales = [
            'en',
            ...subscriptionPageAppConfig.config.additionalLocales.filter((locale) =>
                ['fa', 'ru', 'zh'].includes(locale)
            )
        ]
    }

    return (
        <Container my="xl" size="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Group gap="xs">
                        <Title order={4}>{t('main.page.component.podpiska')}</Title>
                    </Group>
                    <Group gap="xs">
                        <SubscriptionLinkWidget />
                    </Group>
                </Group>

                <Stack gap="xl">
                    <SubscriptionInfoWidget />
                    <InstallationGuideWidget
                        appsConfig={subscriptionPageAppConfig.platforms}
                        enabledLocales={additionalLocales}
                    />
                </Stack>

                <Center>
                    <LanguagePicker enabledLocales={additionalLocales} />
                </Center>
            </Stack>
        </Container>
    )
}
