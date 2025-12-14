import { DefaultMantineColor } from '@mantine/core'
import { Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'

interface IBlockCardProps {
    isMobile: boolean
    icon: React.ReactNode
    title: string
    description: string
    children?: React.ReactNode
    color: DefaultMantineColor
}

export const BlockCardWidget = ({
    isMobile,
    icon,
    title,
    description,
    children,
    color
}: IBlockCardProps) => {
    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg' }} radius="lg" className="step-card">
            <Group gap={isMobile ? 'sm' : 'md'} wrap="nowrap" align="flex-start">
                <ThemeIcon
                    size={isMobile ? 36 : 44}
                    radius="xl"
                    color={color}
                    variant="light"
                    style={{
                        background: `linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)`,
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        flexShrink: 0
                    }}
                >
                    {icon}
                </ThemeIcon>
                <Stack gap={isMobile ? 'xs' : 'sm'} style={{ flex: 1, minWidth: 0 }}>
                    <Title order={6} c="white" fw={600} style={{ wordBreak: 'break-word' }}>
                        <span dangerouslySetInnerHTML={{ __html: title }} />
                    </Title>

                    <Text
                        size={isMobile ? 'xs' : 'sm'}
                        style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: description }} />
                    </Text>

                    {children}
                </Stack>
            </Group>
        </Card>
    )
}
