import { ThemeIcon } from '@mantine/core'

import { ColorGradientStyle } from '../../../../shared/ui/get-color-gradient.util'

interface IProps {
    isMobile: boolean
    svgIconColor: string
    gradientStyle: ColorGradientStyle
    svgIconKey: string
    getIconFromLibrary: (iconKey: string) => string
}
export const ThemeIconShared = (props: IProps) => {
    const { isMobile, svgIconColor, gradientStyle, svgIconKey, getIconFromLibrary } = props

    return (
        <ThemeIcon
            size={isMobile ? 36 : 44}
            radius="xl"
            color={svgIconColor}
            variant="light"
            style={{
                background: gradientStyle.background,
                border: gradientStyle.border,
                boxShadow: gradientStyle.boxShadow,
                flexShrink: 0
            }}
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
