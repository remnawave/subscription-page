import { createTheme } from '@mantine/core'

import components from './overrides'

export const theme = createTheme({
    components,
    cursorType: 'pointer',
    fontFamily: 'Geist, sans-serif',
    fontFamilyMonospace: 'Geist Mono, monospace',
    breakpoints: {
        xs: '25em',
        sm: '30em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        '3xl': '120em',
        '4xl': '160em'
    },
    scale: 1,
    fontSmoothing: true,
    focusRing: 'never',
    white: '#ececee',
    black: '#0e0e10',
    colors: {
        dark: [
            '#c9d1d9',
            '#b1bac4',
            '#8b949e',
            '#6e7681',
            '#484f58',
            '#30363d',
            '#21262d',
            '#161b22',
            '#0d1117',
            '#010409'
        ]
    },
    primaryShade: 1,
    primaryColor: 'gray',
    autoContrast: true,
    luminanceThreshold: 0.3,
    headings: {
        fontFamily: 'Satoshi, Geist, sans-serif',
        fontWeight: '600'
    },
    defaultRadius: 'md'
})
