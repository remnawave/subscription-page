import { ActionIcon, Menu, Text, useDirection } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useEffect } from 'react'
import { getLanguageInfo, TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'
import { vibrate } from '@shared/utils/vibrate'

interface IProps {
    locales: TSubscriptionPageLanguageCode[]
    currentLang: TSubscriptionPageLanguageCode
    onLanguageChange: (lang: TSubscriptionPageLanguageCode) => void
}

export function LanguagePicker(props: IProps) {
    const { locales, currentLang, onLanguageChange } = props

    const { toggleDirection, dir } = useDirection()

    useEffect(() => {
        if (currentLang === 'fa' && dir === 'ltr') {
            toggleDirection()
        }
        if (currentLang !== 'fa' && dir === 'rtl') {
            toggleDirection()
        }
    }, [currentLang])

    const changeLanguage = (value: TSubscriptionPageLanguageCode) => {
        onLanguageChange(value)
    }

    const items = locales.map((item) => {
        const localeInfo = getLanguageInfo(item)
        if (!localeInfo) return null
        return (
            <Menu.Item
                key={item}
                leftSection={<Text>{localeInfo.emoji}</Text>}
                onClick={() => {
                    vibrate('doubleTap')
                    changeLanguage(item)
                }}
            >
                {localeInfo.nativeName}
            </Menu.Item>
        )
    })

    return (
        <Menu position="bottom" width={150} withinPortal withArrow={false}>
            <Menu.Target>
                <ActionIcon
                    color="gray"
                    size="xl"
                    radius="md"
                    variant="default"
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <IconLanguage size={22} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    )
}
