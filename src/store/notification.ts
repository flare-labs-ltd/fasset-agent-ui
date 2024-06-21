import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface INotificationState {
    latestNotificationId: number|undefined;
    setLatestNotificationId: (id: number) => void;
}

/*
export const useNotificationStore = create<INotificationStore>()((set) => ({
    readAt: undefined,
    setReadAt: () => set((state) => ({ readAt: Math.floor((new Date()).getTime() / 1000) })),
}))*/

export const useNotificationStore = create<INotificationState>()(
    persist(
        (set) => ({
            latestNotificationId: undefined,
            setLatestNotificationId: (id: number) => set((state) => ({ latestNotificationId: id })),
        }),
        {
            name: 'notificationStore',
            storage: createJSONStorage(() => localStorage)
        },
    )
)