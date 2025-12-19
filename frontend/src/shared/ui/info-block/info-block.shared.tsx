import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import clsx from 'clsx'

import { IInfoBlockProps } from './interfaces/props.interface'
import classes from './info-block.module.css'

export const InfoBlockShared = ({ color, icon, title, value }: IInfoBlockProps) => {
    return (
        <Box className={clsx(classes.infoBlock, classes[color] || classes.cyan)}>
            <Stack gap={4}>
                <Group gap={4} wrap="nowrap">
                    <ThemeIcon color={color} radius="sm" size="xs" variant="light">
                        {icon}
                    </ThemeIcon>
                    <Text c="dimmed" fw={500} size="xs" truncate>
                        {title}
                    </Text>
                </Group>
                <Text c="white" fw={600} size="sm" truncate>
                    {value}
                </Text>
            </Stack>
        </Box>
    )
}
