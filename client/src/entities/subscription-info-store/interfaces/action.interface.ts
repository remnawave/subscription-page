import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        resetState: () => Promise<void>
        setSubscriptionInfo: (info: IState) => void
    }
}
