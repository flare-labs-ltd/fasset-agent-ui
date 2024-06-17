
import ConnectWalletModal from '@/components/modals/ConnectWalletModal';
import React, { createContext, useContext, useState } from 'react';

type ConnectWalletModalContextType = {
    openConnectWalletModal: (callback?: (wallet: string) => void) => void;
    closeConnectWalletModal: (callback?: () => void) => void;
    openConnectWalletModalCallback?: (wallet: string) => void;
};

const ConnectWalletModalContext = createContext<ConnectWalletModalContextType | null>(null);

export const EthereumLoginProvider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const [openConnectWalletModalCallback, setOpenConnectWalletModalCallback] = useState<() => void>();
    const [isConnectWalletModalActive, setIsConnectWalletModalActive] = useState<boolean>(false); //! dev only, change to false

    function closeConnectWalletModal(callback?: () => void) {
        setIsConnectWalletModalActive(false);
        if (callback) callback();
    }

    function openConnectWalletModal(callback?: (wallet: string) => void) {
        if (callback) setOpenConnectWalletModalCallback(() => callback);
        setIsConnectWalletModalActive(true);
    }

    return (
        <ConnectWalletModalContext.Provider
            value={{
                closeConnectWalletModal: closeConnectWalletModal,
                openConnectWalletModal: openConnectWalletModal,
                openConnectWalletModalCallback: openConnectWalletModalCallback
            }}
        >
            {children}
            <ConnectWalletModal
                opened={isConnectWalletModalActive}
                onClose={closeConnectWalletModal}
            />
        </ConnectWalletModalContext.Provider>
    );
};

export function useConnectWalletModal(): ConnectWalletModalContextType {
    const value = useContext(ConnectWalletModalContext);

    if (!value) {
        throw new Error('Must be used inside Web3-React provider');
    }

    return value as NonNullable<ConnectWalletModalContextType>;
}
