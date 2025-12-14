import { Box, Group, Stack, Text } from '@mantine/core'

import { IBlockRendererProps } from '../../../installation-guide.connector'
import { getColorGradient } from '../../../utils/get-color-gradient.util'

import classes from './minimal-block.module.css'
import { ThemeIconShared } from '../../theme-icon.shared'

export const MinimalBlockRenderer = ({
    blocks,
    isMobile,
    getLocalizedText,
    renderBlockButtons,
    getIconFromLibrary
}: IBlockRendererProps) => {
    return (
        <Stack gap="md">
            {blocks.map((block, index) => {
                const gradientStyle = getColorGradient(block.svgIconColor)

                return (
                    <Box key={index} className={classes.stepBlock}>
                        <Group gap="sm" mb="xs" wrap="nowrap">
                            <ThemeIconShared
                                isMobile={isMobile}
                                svgIconColor={block.svgIconColor}
                                gradientStyle={gradientStyle}
                                svgIconKey={block.svgIconKey}
                                getIconFromLibrary={getIconFromLibrary}
                            />
                            <Text
                                c="white"
                                fw={500}
                                size={isMobile ? 'sm' : 'md'}
                                dangerouslySetInnerHTML={{
                                    __html: getLocalizedText(block.title)
                                }}
                            />
                        </Group>
                        <Text
                            c="dimmed"
                            size={isMobile ? 'xs' : 'sm'}
                            style={{ lineHeight: 1.6 }}
                            dangerouslySetInnerHTML={{
                                __html: getLocalizedText(block.description)
                            }}
                        />
                        {block.buttons.length > 0 && (
                            <Box style={{ marginTop: 8 }}>
                                {renderBlockButtons(block.buttons, 'subtle')}
                            </Box>
                        )}
                    </Box>
                )
            })}
        </Stack>
    )
}
