import { Stack, Text, Timeline } from '@mantine/core'

import { IBlockRendererProps } from '../../../installation-guide.connector'
import { getColorGradientSolid } from '@shared/ui/get-color-gradient.util'

import classes from './timeline-block.module.css'
import { ThemeIconShared } from '../../theme-icon.shared'

export const TimelineBlockRenderer = ({
    blocks,
    isMobile,
    getLocalizedText,
    renderBlockButtons,
    getIconFromLibrary
}: IBlockRendererProps) => {
    return (
        <Timeline
            active={blocks.length}
            bulletSize={isMobile ? 36 : 44}
            lineWidth={2}
            color="cyan"
            classNames={{
                root: classes.timelineRoot,
                item: classes.timelineItem,
                itemBullet: classes.timelineItemBullet
            }}
        >
            {blocks.map((block, index) => {
                const gradientStyle = getColorGradientSolid(block.svgIconColor)

                return (
                    <Timeline.Item
                        key={index}
                        bullet={
                            <ThemeIconShared
                                isMobile={isMobile}
                                svgIconColor={block.svgIconColor}
                                gradientStyle={gradientStyle}
                                svgIconKey={block.svgIconKey}
                                getIconFromLibrary={getIconFromLibrary}
                            />
                        }
                        title={
                            <Text
                                c="white"
                                fw={600}
                                size={isMobile ? 'sm' : 'md'}
                                dangerouslySetInnerHTML={{
                                    __html: getLocalizedText(block.title)
                                }}
                            />
                        }
                    >
                        <Stack gap="xs">
                            <Text
                                c="dimmed"
                                size={isMobile ? 'xs' : 'sm'}
                                style={{ lineHeight: 1.6 }}
                                dangerouslySetInnerHTML={{
                                    __html: getLocalizedText(block.description)
                                }}
                            />
                            {renderBlockButtons(block.buttons, 'light')}
                        </Stack>
                    </Timeline.Item>
                )
            })}
        </Timeline>
    )
}
