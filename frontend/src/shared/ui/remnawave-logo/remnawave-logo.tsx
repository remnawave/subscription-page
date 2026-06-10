import { Box, BoxProps, ElementProps } from '@mantine/core'

interface RemnawaveLogoProps
    extends ElementProps<'img', keyof BoxProps>, Omit<BoxProps, 'children' | 'ref'> {
    size?: number | string
}

/**
 * PoletVPN brand mark. Kept under the original `RemnawaveLogo` name so the
 * default fallback (no custom logo in panel config) renders the PoletVPN
 * aviator wordmark instead of the Remnawave glyph.
 */
export function RemnawaveLogo({ size = 32, style, ...props }: RemnawaveLogoProps) {
    return (
        <Box
            alt="PoletVPN"
            component="img"
            src="/assets/logo.png"
            style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, ...style }}
            {...props}
        />
    )
}
