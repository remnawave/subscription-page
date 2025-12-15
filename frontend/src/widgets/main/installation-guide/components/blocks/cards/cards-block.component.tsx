import { Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'

import { IBlockRendererProps } from '../../../installation-guide.connector'
import { getColorGradient } from '../../../../../../shared/ui/get-color-gradient.util'
import { ThemeIconShared } from '../../theme-icon.shared'

export const CardsBlockRenderer = ({
    blocks,
    isMobile,
    getLocalizedText,
    renderBlockButtons,
    getIconFromLibrary
}: IBlockRendererProps) => {
    return (
        <Stack gap="sm">
            {blocks.map((block, index) => {
                const gradientStyle = getColorGradient(block.svgIconColor)

                return (
                    <Card
                        key={index}
                        p={{ base: 'sm', xs: 'md', sm: 'lg' }}
                        radius="lg"
                        className="step-card"
                    >
                        <Group gap={isMobile ? 'sm' : 'md'} wrap="nowrap" align="flex-start">
                            <ThemeIconShared
                                isMobile={isMobile}
                                svgIconColor={block.svgIconColor}
                                gradientStyle={gradientStyle}
                                svgIconKey={block.svgIconKey}
                                getIconFromLibrary={getIconFromLibrary}
                            />
                            <Stack gap={isMobile ? 'xs' : 'sm'} style={{ flex: 1, minWidth: 0 }}>
                                <Title
                                    order={6}
                                    c="white"
                                    fw={600}
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.title)
                                        }}
                                    />
                                </Title>

                                <Text
                                    size={isMobile ? 'xs' : 'sm'}
                                    style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.description)
                                        }}
                                    />
                                </Text>

                                {renderBlockButtons(block.buttons, 'light')}
                            </Stack>
                        </Group>
                    </Card>
                )
            })}
        </Stack>
    )
}
