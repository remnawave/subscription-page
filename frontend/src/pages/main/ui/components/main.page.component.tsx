import { Box, Center, Container, Group, Image, Stack, Text, Title } from '@mantine/core'

import {
    ISubscriptionPageAppConfig,
    TEnabledLocales
} from '@shared/constants/apps-config/interfaces/app-list.interface'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { Page, RemnawaveLogo } from '@shared/ui'

import { InstallationGuideWidget } from '../../../../widgets/main/installation-guide/installation-guide.widget'
import { SubscriptionLinkWidget } from '../../../../widgets/main/subscription-link/subscription-link.widget'
import { SubscriptionInfoWidget } from '../../../../widgets/main/subscription-info/subscription-info.widget'
import { RawKeysWidget } from '../../../../widgets/main/raw-keys/raw-keys.widget'

export const MainPageComponent = ({
    subscriptionPageAppConfig,
    isMobile
}: {
    subscriptionPageAppConfig: ISubscriptionPageAppConfig
    isMobile: boolean
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

    const brandName = subscriptionPageAppConfig.config.branding?.name || 'Remnawave'
    let hasCustomLogo = !!subscriptionPageAppConfig.config.branding?.logoUrl

    if (hasCustomLogo) {
        if (subscriptionPageAppConfig.config.branding?.logoUrl?.includes('docs.rw')) {
            hasCustomLogo = false
        }
    }

    return (
        <Page>
            <Box className="header-wrapper" py="md">
                <Container maw={1200} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap" style={{ userSelect: 'none' }}>
                            {hasCustomLogo ? (
                                <Image
                                    alt="logo"
                                    fit="contain"
                                    src={subscriptionPageAppConfig.config.branding!.logoUrl}
                                    style={{
                                        maxWidth: '32px',
                                        maxHeight: '32px',
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                />
                            ) : (
                                <RemnawaveLogo c="cyan" size={32} />
                            )}
                            <Title order={4} fw={700} size="lg">
                                <Text component="span" inherit c={hasCustomLogo ? 'white' : 'cyan'}>
                                    {brandName}
                                </Text>
                            </Title>
                        </Group>

                        <Group gap="xs">
                            <SubscriptionLinkWidget
                                supportUrl={subscriptionPageAppConfig.config.branding?.supportUrl}
                            />
                        </Group>
                    </Group>
                </Container>
            </Box>

            <Container
                maw={1200}
                px={{ base: 'md', sm: 'lg', md: 'xl' }}
                py="xl"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Stack gap="xl">
                    <SubscriptionInfoWidget isMobile={isMobile} />
                    <InstallationGuideWidget
                        appsConfig={subscriptionPageAppConfig.platforms}
                        enabledLocales={additionalLocales}
                        isMobile={isMobile}
                    />
                    <RawKeysWidget isMobile={isMobile} />

                    <Center>
                        <LanguagePicker enabledLocales={additionalLocales} />
                    </Center>
                </Stack>
            </Container>
        </Page>
    )
}
