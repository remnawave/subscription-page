import { createTheme } from '@mantine/core'

import components from './overrides'

export const theme = createTheme({
    components,
    cursorType: 'pointer',
    fontFamily:
        'Geist, Vazirmatn, Apple Color Emoji, Noto Sans SC, Twemoji Country Flags, sans-serif',
    fontFamilyMonospace: 'Geist Mono, Fira Mono, monospace',
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
    white: '#ffffff',
    black: '#2d4d76',
    colors: {
        // PoletVPN brand accent (#329fff) — fill, links, focus, borders
        brand: [
            '#eaf5ff',
            '#d4eaff',
            '#a8d3ff',
            '#7abcff',
            '#52a8ff',
            '#329fff',
            '#1f8cef',
            '#1572cc',
            '#0e59a3',
            '#06407a'
        ],
        // navy "ink" scale used in place of the old dark scale for text
        dark: [
            '#f1f5f9',
            '#dbe3ee',
            '#b8c3c7',
            '#8aa0b8',
            '#5d7795',
            '#3f5f82',
            '#2d4d76',
            '#243d5e',
            '#1b2e47',
            '#121f30'
        ],

        blue: [
            '#ddf4ff',
            '#b6e3ff',
            '#80ccff',
            '#54aeff',
            '#218bff',
            '#0969da',
            '#0550ae',
            '#033d8b',
            '#0a3069',
            '#002155'
        ],
        green: [
            '#dafbe1',
            '#aceebb',
            '#6fdd8b',
            '#4ac26b',
            '#2da44e',
            '#1a7f37',
            '#116329',
            '#044f1e',
            '#003d16',
            '#002d11'
        ],
        yellow: [
            '#fff8c5',
            '#fae17d',
            '#eac54f',
            '#d4a72c',
            '#bf8700',
            '#9a6700',
            '#7d4e00',
            '#633c01',
            '#4d2d00',
            '#3b2300'
        ],
        orange: [
            '#fff1e5',
            '#ffd8b5',
            '#ffb77c',
            '#fb8f44',
            '#e16f24',
            '#bc4c00',
            '#953800',
            '#762c00',
            '#5c2200',
            '#471700'
        ]
    },
    primaryShade: 5,
    primaryColor: 'brand',
    autoContrast: true,
    luminanceThreshold: 0.3,
    headings: {
        fontFamily: 'Geist, Vazirmatn, Apple Color Emoji, Noto Sans SC, sans-serif',
        fontWeight: '600'
    },
    defaultRadius: 'md'
})
