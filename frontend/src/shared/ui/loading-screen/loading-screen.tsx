import { Spinner } from '@gfazioli/mantine-spinner'
import { Center, Stack } from '@mantine/core'

export function LoadingScreen({ height = '100%' }: { height?: string }) {
    return (
        <Center h={height}>
            <Stack align="center" gap="xs" w="100%">
                <Spinner
                    inner={50}
                    segments={30}
                    size={150}
                    speed={1_900}
                    strokeLinecap="butt"
                    thickness={2}
                />
            </Stack>
        </Center>
    )
}
