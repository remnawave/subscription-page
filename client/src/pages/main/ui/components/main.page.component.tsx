import { Container, Group, Stack, Title } from '@mantine/core'

import { InstallationGuideWidget } from '../../../../widgets/main/installation-guide/installation-guide.widget'
import { SubscriptionLinkWidget } from '../../../../widgets/main/subscription-link/subscription-link.widget'
import { SubscriptionInfoWidget } from '../../../../widgets/main/subscription-info/subscription-info.widget'

export const MainPageComponent = () => {
    return (
        <Container my="xl" size="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Title order={4}>Подписка</Title>
                    <SubscriptionLinkWidget />
                </Group>
                <SubscriptionInfoWidget />
                <InstallationGuideWidget />
            </Stack>
        </Container>
    )
}
