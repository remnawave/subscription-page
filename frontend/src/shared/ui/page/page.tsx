import { forwardRef, ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { nprogress } from '@mantine/nprogress'
import { Box, BoxProps } from '@mantine/core'

interface PageProps extends BoxProps {
    children: ReactNode
}

export const Page = forwardRef<HTMLDivElement, PageProps>(({ children, ...other }, ref) => {
    useEffect(() => {
        nprogress.complete()
        return () => nprogress.start()
    }, [])

    return (
        <AnimatePresence>
            <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{
                    duration: 0.5,
                    ease: 'easeInOut'
                }}
            >
                <Box ref={ref} {...other}>
                    {children}
                </Box>
            </motion.div>
        </AnimatePresence>
    )
})
