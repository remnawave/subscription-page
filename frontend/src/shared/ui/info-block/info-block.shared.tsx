import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core'

import { IInfoBlockProps } from './interfaces/props.interface'

const colorGradients: Record<string, { background: string; border: string }> = {
    blue: {
        background:
            'linear-gradient(135deg, rgba(34, 139, 230, 0.1) 0%, rgba(28, 126, 214, 0.05) 100%)',
        border: 'rgba(34, 139, 230, 0.2)'
    },
    cyan: {
        background:
            'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
        border: 'rgba(34, 211, 238, 0.2)'
    },
    green: {
        background:
            'linear-gradient(135deg, rgba(64, 192, 87, 0.1) 0%, rgba(55, 178, 77, 0.05) 100%)',
        border: 'rgba(64, 192, 87, 0.2)'
    },
    teal: {
        background:
            'linear-gradient(135deg, rgba(32, 201, 151, 0.1) 0%, rgba(18, 184, 134, 0.05) 100%)',
        border: 'rgba(32, 201, 151, 0.2)'
    },
    red: {
        background:
            'linear-gradient(135deg, rgba(250, 82, 82, 0.1) 0%, rgba(224, 49, 49, 0.05) 100%)',
        border: 'rgba(250, 82, 82, 0.2)'
    },
    yellow: {
        background:
            'linear-gradient(135deg, rgba(250, 176, 5, 0.1) 0%, rgba(245, 159, 0, 0.05) 100%)',
        border: 'rgba(250, 176, 5, 0.2)'
    },
    orange: {
        background:
            'linear-gradient(135deg, rgba(253, 126, 20, 0.1) 0%, rgba(247, 103, 7, 0.05) 100%)',
        border: 'rgba(253, 126, 20, 0.2)'
    },
    violet: {
        background:
            'linear-gradient(135deg, rgba(151, 117, 250, 0.1) 0%, rgba(132, 94, 247, 0.05) 100%)',
        border: 'rgba(151, 117, 250, 0.2)'
    }
}

export const InfoBlockShared = (props: IInfoBlockProps) => {
    const { color, icon, title, value } = props

    const gradient = colorGradients[color] || colorGradients.cyan

    return (
        <Box
            p="xs"
            style={{
                background: gradient.background,
                border: `1px solid ${gradient.border}`,
                borderRadius: 'var(--mantine-radius-md)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
            }}
        >
            <Stack gap={4}>
                <Group gap={4} wrap="nowrap">
                    <ThemeIcon color={color} size="xs" variant="light" radius="sm">
                        {icon}
                    </ThemeIcon>
                    <Text fw={500} size="xs" c="dimmed" truncate>
                        {title}
                    </Text>
                </Group>
                <Text fw={600} size="sm" c="white" truncate>
                    {value}
                </Text>
            </Stack>
        </Box>
    )
}
