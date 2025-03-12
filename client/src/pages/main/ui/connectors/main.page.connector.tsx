import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { LoadingScreen } from '@shared/ui'

import { MainPageComponent } from '../components/main.page.component'

export const MainPageConnector = () => {
    const { remnawaveSubscription } = useSubscriptionInfoStoreInfo()

    if (!remnawaveSubscription) return <LoadingScreen />

    return <MainPageComponent />
}
