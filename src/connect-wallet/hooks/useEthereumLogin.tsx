
import ConnectWalletModal from '../components/modals/ConnectWalletModal';
import React, { createContext, useContext, useState } from 'react';

type ConnectWalletModalContextType = {
    modalStatus: boolean;
    openConnectWalletModal: () => void;
    closeConnectWalletModal: () => void;
};

const ConnectWalletModalContext = createContext<ConnectWalletModalContextType | null>(null);

export const EthereumLoginProvider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const [isConnectWalletModalActive, setIsConnectWalletModalActive] = useState<boolean>(false); //! dev only, change to false

    function closeConnectWalletModal(): void {
        setIsConnectWalletModalActive(false);
    }

    function openConnectWalletModal(): void {
        setIsConnectWalletModalActive(true);
    }

    return (
        <ConnectWalletModalContext.Provider
            value={{
                modalStatus: isConnectWalletModalActive,
                closeConnectWalletModal: closeConnectWalletModal,
                openConnectWalletModal: openConnectWalletModal,
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
