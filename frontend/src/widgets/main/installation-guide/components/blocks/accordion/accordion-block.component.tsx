import { IconChevronDown } from '@tabler/icons-react'
import { Accordion, Group, Stack, Text } from '@mantine/core'
import { useState } from 'react'

import { IBlockRendererProps } from '../../../installation-guide.connector'
import { getColorGradient } from '../../../../../../shared/ui/get-color-gradient.util'

import classes from './accordion-block.module.css'
import { ThemeIconShared } from '../../theme-icon.shared'
import { vibrate } from '@shared/utils/vibrate'

export const AccordionBlockRenderer = ({
    blocks,
    isMobile,
    getLocalizedText,
    renderBlockButtons,
    getIconFromLibrary
}: IBlockRendererProps) => {
    const [openedAccordion, setOpenedAccordion] = useState<string | null>('0')

    return (
        <Accordion
            value={openedAccordion}
            onChange={(value) => {
                vibrate('tap')
                setOpenedAccordion(value)
            }}
            variant="separated"
            radius="lg"
            chevron={<IconChevronDown size={18} />}
            transitionDuration={200}
            classNames={{
                item: classes.accordionItem,
                control: classes.accordionControl,
                chevron: classes.accordionChevron,
                content: classes.accordionContent,
                label: classes.accordionLabel
            }}
        >
            {blocks.map((block, index) => {
                const gradientStyle = getColorGradient(block.svgIconColor)

                return (
                    <Accordion.Item key={index} value={String(index)}>
                        <Accordion.Control>
                            <Group gap="sm" wrap="nowrap">
                                <ThemeIconShared
                                    isMobile={isMobile}
                                    svgIconColor={block.svgIconColor}
                                    gradientStyle={gradientStyle}
                                    svgIconKey={block.svgIconKey}
                                    getIconFromLibrary={getIconFromLibrary}
                                />
                                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        c="white"
                                        fw={600}
                                        size={isMobile ? 'sm' : 'md'}
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.title)
                                        }}
                                    />
                                </Stack>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text
                                c="dimmed"
                                size={isMobile ? 'xs' : 'sm'}
                                style={{ lineHeight: 1.7 }}
                                dangerouslySetInnerHTML={{
                                    __html: getLocalizedText(block.description)
                                }}
                            />
                            <Group gap="xs" wrap="wrap" mt="sm">
                                {renderBlockButtons(block.buttons, 'light')}
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                )
            })}
        </Accordion>
    )
}
