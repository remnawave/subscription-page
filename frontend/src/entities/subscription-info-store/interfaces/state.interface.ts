import { GetSubscriptionInfoByShortUuidCommand } from '@remnawave/backend-contract'

export interface IState {
    subscription: GetSubscriptionInfoByShortUuidCommand.Response['response'] | null
}
