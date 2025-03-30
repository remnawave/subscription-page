import { Group, Paper, Text, ThemeIcon } from '@mantine/core'

import { IInfoBlockProps } from './interfaces/props.interface'

export const InfoBlockShared = (props: IInfoBlockProps) => {
    const { color, icon, title, value } = props

    return (
        <Paper p="xs" radius="lg">
            <Group mb={4}>
                <ThemeIcon color={color} size="lg" variant="light">
                    {icon}
                </ThemeIcon>
                <Text fw={500} size="lg">
                    {title}
                </Text>
            </Group>
            <Text c="dimmed" truncate>
                {value}
            </Text>
        </Paper>
    )
}
