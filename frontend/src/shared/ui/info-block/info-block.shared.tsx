import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import clsx from 'clsx'

import { IInfoBlockProps } from './interfaces/props.interface'
import classes from './info-block.module.css'

export const InfoBlockShared = ({ color, icon, title, value }: IInfoBlockProps) => {
    return (
        <Box className={clsx(classes.infoBlock, classes[color] || classes.cyan)}>
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
