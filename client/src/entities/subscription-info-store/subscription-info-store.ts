import { create } from 'zustand'

import { IActions, IState } from './interfaces'

const initialState: IState = {
    subscription: null
}

export const useSubscriptionInfoStore = create<IActions & IState>()((set) => ({
    ...initialState,
    actions: {
        setSubscriptionInfo: (info: IState) => {
            set((state) => ({
                ...state,
                subscription: info.subscription
            }))
        },
        getInitialState: () => {
            return initialState
        },
        resetState: async () => {
            set({ ...initialState })
        }
    }
}))

export const useSubscriptionInfoStoreActions = () =>
    useSubscriptionInfoStore((store) => store.actions)

export const useSubscriptionInfoStoreInfo = () => useSubscriptionInfoStore((state) => state)
