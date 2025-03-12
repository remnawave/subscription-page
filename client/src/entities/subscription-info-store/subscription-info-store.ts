import { devtools } from 'zustand/middleware'
import { create } from 'zustand'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    remnawaveSubscription: null
}

export const useSubscriptionInfoStore = create<IActions & IState>()(
    devtools(
        (set) => ({
            ...initialState,
            actions: {
                setSubscriptionInfo: (info: IState) => {
                    set((state) => ({
                        ...state,
                        remnawaveSubscription: info.remnawaveSubscription
                    }))
                },
                getInitialState: () => {
                    return initialState
                },
                resetState: async () => {
                    set({ ...initialState })
                }
            }
        }),
        {
            name: 'subscriptionInfoStore',
            anonymousActionType: 'subscriptionInfoStore'
        }
    )
)

export const useSubscriptionInfoStoreActions = () =>
    useSubscriptionInfoStore((store) => store.actions)

export const useSubscriptionInfoStoreInfo = () => useSubscriptionInfoStore((state) => state)
