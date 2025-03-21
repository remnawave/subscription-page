import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { LoadingScreen } from '@shared/ui'

import { MainPageComponent } from '../components/main.page.component'

export const MainPageConnector = () => {
    const { subscription } = useSubscriptionInfoStoreInfo()

    if (!subscription) return <LoadingScreen />

    return <MainPageComponent />
}
