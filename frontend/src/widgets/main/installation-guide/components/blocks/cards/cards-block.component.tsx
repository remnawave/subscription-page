import { Card, Group, Stack, Text, Title } from '@mantine/core'

import { getColorGradient, getLocalizedText } from '@shared/utils/config-parser'
import { ThemeIconShared } from '@shared/ui'

import { IBlockRendererProps } from '../renderer-block.interface'

export const CardsBlockRenderer = ({
    blocks,
    isMobile,
    currentLang,
    renderBlockButtons,
    getIconFromLibrary
}: IBlockRendererProps) => {
    return (
        <Stack gap="sm">
            {blocks.map((block, index) => {
                const gradientStyle = getColorGradient(block.svgIconColor)

                return (
                    <Card
                        className="step-card"
                        key={index}
                        p={{ base: 'sm', xs: 'md', sm: 'lg' }}
                        radius="lg"
                    >
                        <Group align="flex-start" gap={isMobile ? 'sm' : 'md'} wrap="nowrap">
                            <ThemeIconShared
                                getIconFromLibrary={getIconFromLibrary}
                                gradientStyle={gradientStyle}
                                isMobile={isMobile}
                                svgIconColor={block.svgIconColor}
                                svgIconKey={block.svgIconKey}
                            />
                            <Stack gap={isMobile ? 'xs' : 'sm'} style={{ flex: 1, minWidth: 0 }}>
                                <Title
                                    c="white"
                                    fw={600}
                                    order={6}
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.title, currentLang)
                                        }}
                                    />
                                </Title>

                                <Text
                                    size={isMobile ? 'xs' : 'sm'}
                                    style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.description, currentLang)
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
