import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'

export interface IState {
    remnawaveSubscription: GetSubscriptionInfoByShortUuidCommand.Response['response'] | null
}
