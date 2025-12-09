import { ActionIcon, Menu, Text, useDirection } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { TEnabledLocales } from '@shared/constants/apps-config/interfaces/app-list.interface'

const data = [
    { label: 'English', emoji: '🇺🇸', value: 'en' },
    { label: 'Русский', emoji: '🇷🇺', value: 'ru' },
    { label: 'فارسی', emoji: '🇮🇷', value: 'fa' },
    { label: '简体中文', emoji: '🇨🇳', value: 'zh' },
    { label: 'Français', emoji: '🇫🇷', value: 'fr' }
]

export function LanguagePicker({ enabledLocales }: { enabledLocales: TEnabledLocales[] }) {
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const { toggleDirection, dir } = useDirection()

    const filteredData = data.filter((item) =>
        enabledLocales.includes(item.value as TEnabledLocales)
    )

    const { i18n } = useTranslation()

    useEffect(() => {
        const savedLanguage = i18n.language

        if (savedLanguage) {
            if (savedLanguage === 'fa') {
                if (dir === 'ltr') {
                    toggleDirection()
                }
            }
        }
    }, [i18n])

    useEffect(() => {
        setSelectedLanguage(i18n.language)
    }, [i18n])

    const changeLanguage = (value: string) => {
        i18n.changeLanguage(value)

        if (value === 'fa' && dir === 'ltr') {
            toggleDirection()
        }

        if (dir === 'rtl' && value !== 'fa') {
            toggleDirection()
        }

        setSelectedLanguage(value)
    }

    const items = filteredData.map((item) => (
        <Menu.Item
            key={item.value}
            leftSection={<Text>{item.emoji}</Text>}
            onClick={() => changeLanguage(item.value)}
        >
            {item.label}
        </Menu.Item>
    ))

    return (
        <Menu position="bottom-end" width={150} withinPortal>
            <Menu.Target>
                <ActionIcon
                    color="gray"
                    size="xl"
                    radius="md"
                    variant="default"
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <IconLanguage size={22} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    )
}
