import { Center, Container, Group, Image, Stack, Title } from '@mantine/core'

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
    let additionalLocales: TEnabledLocales[] = ['en', 'ru', 'fa', 'zh', 'fr']

    if (subscriptionPageAppConfig.config.additionalLocales !== undefined) {
        additionalLocales = [
            'en',
            ...subscriptionPageAppConfig.config.additionalLocales.filter((locale) =>
                ['fa', 'fr', 'ru', 'zh'].includes(locale)
            )
        ]
    }

    return (
        <Container my="xl" size="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Group
                        gap="xs"
                        style={{
                            userSelect: 'none'
                        }}
                    >
                        {subscriptionPageAppConfig.config.branding?.logoUrl && (
                            <Image
                                alt="logo"
                                fit="contain"
                                src={subscriptionPageAppConfig.config.branding.logoUrl}
                                style={{
                                    maxWidth: '36px',
                                    maxHeight: '36px',
                                    width: 'auto',
                                    height: 'auto'
                                }}
                            />
                        )}

                        <Title order={4} size="md">
                            {subscriptionPageAppConfig.config.branding?.name || 'Subscription'}
                        </Title>
                    </Group>

                    <Group gap="xs">
                        <SubscriptionLinkWidget
                            supportUrl={subscriptionPageAppConfig.config.branding?.supportUrl}
                        />
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
