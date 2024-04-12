
import ConnectWalletModal from '../components/modals/ConnectWalletModal';
import React, { createContext, useContext, useState } from 'react';

type ConnectWalletModalContextType = {
    isConnectWalletModal: boolean;
    openConnectWalletModal: () => void;
    closeConnectWalletModal: () => void;
};

const ConnectWalletModalContext = createContext<ConnectWalletModalContextType | null>(null);

export const EthereumLoginProvider = ({ children }: React.PropsWithChildren<{ children: JSX.Element }>) => {
    const [isConnectWalletModal, setConnectWalletModal] = useState<boolean>(false); //! dev only, change to false

    function closeConnectWalletModal() {
        setConnectWalletModal(false);
    }

    function openConnectWalletModal() {
        setConnectWalletModal(true);
    }

    return (
        <ConnectWalletModalContext.Provider
            value={{
                isConnectWalletModal: isConnectWalletModal,
                closeConnectWalletModal: closeConnectWalletModal,
                openConnectWalletModal: openConnectWalletModal,
            }}
        >
            {children}
            <ConnectWalletModal opened={isConnectWalletModal} onClose={closeConnectWalletModal} />
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
