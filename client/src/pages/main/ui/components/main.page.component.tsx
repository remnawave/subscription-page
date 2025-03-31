import { Center, Container, Group, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { IPlatformConfig } from '@shared/constants/apps-config/interfaces/app-list.interface'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'

import { InstallationGuideWidget } from '../../../../widgets/main/installation-guide/installation-guide.widget'
import { SubscriptionLinkWidget } from '../../../../widgets/main/subscription-link/subscription-link.widget'
import { SubscriptionInfoWidget } from '../../../../widgets/main/subscription-info/subscription-info.widget'

export const MainPageComponent = ({ appsConfig }: { appsConfig: IPlatformConfig }) => {
    const { t } = useTranslation()

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
                    <InstallationGuideWidget appsConfig={appsConfig} />
                </Stack>

                <Center>
                    <LanguagePicker />
                </Center>
            </Stack>
        </Container>
    )
}
