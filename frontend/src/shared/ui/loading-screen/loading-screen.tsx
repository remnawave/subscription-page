import { Center, Stack } from '@mantine/core'
import { Spinner } from '@gfazioli/mantine-spinner'

export function LoadingScreen({ height = '100%' }: { height?: string }) {
    return (
        <Center h={height}>
            <Stack align="center" gap="xs" w="100%">
                <Spinner
                    size={150}
                    inner={50}
                    segments={30}
                    thickness={2}
                    speed={1_900}
                    strokeLinecap="butt"
                />
            </Stack>
        </Center>
    )
}
