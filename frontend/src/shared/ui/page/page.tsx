import { forwardRef, ReactNode, useEffect } from 'react'
import { nprogress } from '@mantine/nprogress'
import { Box, BoxProps } from '@mantine/core'

import classes from './page.module.css'

interface PageProps extends BoxProps {
    children: ReactNode
}

export const Page = forwardRef<HTMLDivElement, PageProps>(({ children, ...other }, ref) => {
    useEffect(() => {
        nprogress.complete()
        return () => nprogress.start()
    }, [])

    return (
        <Box ref={ref} className={classes.page} {...other}>
            {children}
        </Box>
    )
})
