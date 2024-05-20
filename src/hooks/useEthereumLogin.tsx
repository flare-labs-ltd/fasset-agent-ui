
import ConnectWalletModal from '@/components/modals/ConnectWalletModal';
import React, { createContext, useContext, useState } from 'react';

type ConnectWalletModalContextType = {
    openConnectWalletModal: (onSelectedWalletCallback?: () => void) => void;
    closeConnectWalletModal: () => void;
    selectedWalletCallback?: (wallet: string) => void
};

const ConnectWalletModalContext = createContext<ConnectWalletModalContextType | null>(null);

export const EthereumLoginProvider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const [selectedWalletCallback, setSelectedWalletCallback] = useState(null);
    const [isConnectWalletModalActive, setIsConnectWalletModalActive] = useState<boolean>(false); //! dev only, change to false

    function closeConnectWalletModal() {
        setIsConnectWalletModalActive(false);
    }

    function openConnectWalletModal(callback?: () => void) {
        if (callback) setSelectedWalletCallback(() => callback);
        setIsConnectWalletModalActive(true);
    }

    return (
        <ConnectWalletModalContext.Provider
            value={{
                closeConnectWalletModal: closeConnectWalletModal,
                openConnectWalletModal: openConnectWalletModal,
                selectedWalletCallback: selectedWalletCallback
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
