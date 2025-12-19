import { Accordion, Group, Stack, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useState } from 'react'

import { getColorGradient, getLocalizedText } from '@shared/utils/config-parser'
import { vibrate } from '@shared/utils/vibrate'
import { ThemeIconShared } from '@shared/ui'

import { IBlockRendererProps } from '../renderer-block.interface'
import classes from './accordion-block.module.css'

export const AccordionBlockRenderer = ({
    blocks,
    isMobile,
    currentLang,
    renderBlockButtons,
    getIconFromLibrary
}: IBlockRendererProps) => {
    const [openedAccordion, setOpenedAccordion] = useState<null | string>('0')

    return (
        <Accordion
            chevron={<IconChevronDown size={18} />}
            classNames={{
                item: classes.accordionItem,
                control: classes.accordionControl,
                chevron: classes.accordionChevron,
                content: classes.accordionContent,
                label: classes.accordionLabel
            }}
            onChange={(value) => {
                vibrate('tap')
                setOpenedAccordion(value)
            }}
            radius="lg"
            transitionDuration={200}
            value={openedAccordion}
            variant="separated"
        >
            {blocks.map((block, index) => {
                const gradientStyle = getColorGradient(block.svgIconColor)

                return (
                    <Accordion.Item key={index} value={String(index)}>
                        <Accordion.Control>
                            <Group gap="sm" wrap="nowrap">
                                <ThemeIconShared
                                    getIconFromLibrary={getIconFromLibrary}
                                    gradientStyle={gradientStyle}
                                    isMobile={isMobile}
                                    svgIconColor={block.svgIconColor}
                                    svgIconKey={block.svgIconKey}
                                />
                                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        c="white"
                                        dangerouslySetInnerHTML={{
                                            __html: getLocalizedText(block.title, currentLang)
                                        }}
                                        fw={600}
                                        size={isMobile ? 'sm' : 'md'}
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    />
                                </Stack>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text
                                c="dimmed"
                                dangerouslySetInnerHTML={{
                                    __html: getLocalizedText(block.description, currentLang)
                                }}
                                size={isMobile ? 'xs' : 'sm'}
                                style={{ lineHeight: 1.7 }}
                            />
                            <Group gap="xs" mt="sm" wrap="wrap">
                                {renderBlockButtons(block.buttons, 'light')}
                            </Group>
                        </Accordion.Panel>
                    </Accordion.Item>
                )
            })}
        </Accordion>
    )
}
