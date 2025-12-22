import { ThemeIcon } from '@mantine/core'

import { ColorGradientStyle } from '@shared/utils/config-parser'

interface IProps {
    getIconFromLibrary: (iconKey: string) => string
    gradientStyle: ColorGradientStyle
    isMobile: boolean
    svgIconColor: string
    svgIconKey: string
}
export const ThemeIconShared = (props: IProps) => {
    const { isMobile, svgIconColor, gradientStyle, svgIconKey, getIconFromLibrary } = props

    return (
        <ThemeIcon
            color={svgIconColor}
            radius="xl"
            size={isMobile ? 36 : 44}
            style={{
                background: gradientStyle.background,
                border: gradientStyle.border,
                boxShadow: gradientStyle.boxShadow,
                flexShrink: 0
            }}
            variant="light"
        >
            <span
                dangerouslySetInnerHTML={{
                    __html: getIconFromLibrary(svgIconKey)
                }}
                style={{ display: 'flex', alignItems: 'center' }}
            />
        </ThemeIcon>
    )
}
