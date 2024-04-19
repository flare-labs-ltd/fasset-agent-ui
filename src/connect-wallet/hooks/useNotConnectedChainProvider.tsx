import { appChainParams, ChainIdName } from '../chains/chains';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

interface IGlobalNotConnectedChain {}

interface NotConnectedChainId {
    notConnectedChainId: ChainIdName | undefined;
    setNotConnectedChainId: Dispatch<SetStateAction<ChainIdName | undefined>>;
}

export const globalChainIdStateContext = createContext<NotConnectedChainId | null>(null);

export const GlobalStateChainIdWhenNotConnected = ({ children }: PropsWithChildren<IGlobalNotConnectedChain>) => {
    const [notConnectedChainId, setNotConnectedChainId] = useState<ChainIdName | undefined>(appChainParams.desiredChainID);

    return <globalChainIdStateContext.Provider value={{ notConnectedChainId, setNotConnectedChainId }}>{children}</globalChainIdStateContext.Provider>;
};

export function useGlobalStateChainIdWhenNotConnected(): NotConnectedChainId {
    const value = useContext(globalChainIdStateContext);

    if (!value) {
        throw new Error('Must be used inside GlobalStateChainIdWhenNotConnected provider');
    }

    return value as NonNullable<NotConnectedChainId>;
}
