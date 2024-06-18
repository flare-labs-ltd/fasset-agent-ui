import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSecretExists } from "@/api/agent";
import { LoadingOverlay } from "@mantine/core";

export default function AuthGuard({ children }: { children: React.ReactNode}) {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const router = useRouter();
    const secretExists = useSecretExists();

    const isAgentConfigured = async()  => {
        setIsInitializing(true);
        if (secretExists.data === false) {
            console.log('redirect')
            await router.push('/configure');
        }
        setIsInitializing(false);
    }

    const isWalletConnected = useCallback(async()  => {
        setIsInitializing(true);
        const localStorage = window.localStorage.getItem('ACTIVE_CONNECTION');
        let routerStatus = false;
        let connected = false;

        if (localStorage) {
            const data = JSON.parse(localStorage);
            if (!data.hasOwnProperty('wallet')) {
                routerStatus = await router.push('/connect');
            } else {
                connected = true;
                setIsConnected(true);
            }
        } else {
            routerStatus = await router.push('/connect');
        }

        if (routerStatus || connected) {
            setIsInitializing(false);
        }
    }, [router]);

    useEffect(() => {
        if (secretExists.isFetched && isConnected) {
            isAgentConfigured();
        }
    }, [isConnected, secretExists.isFetched]);

    useEffect(() =>     {
        isWalletConnected();
        router.events.on('routeChangeComplete', isWalletConnected)

        return () => {
            router.events.off('routeChangeComplete', isWalletConnected);
        }
    }, []);

    if (isInitializing) {
        return <LoadingOverlay
            visible={true}
            zIndex={1000}
        />;
    }

    return children;
    /*const [agentConfigured, setAgentConfigured] = useState<boolean>(false);
    const router = useRouter();
    const secretExists = useSecretExists();

    const isAgentConfigured = ()  => {
        if (secretExists.data === false) {
            setAgentConfigured(false);
            router.push('/setup');
        } else {
            setAgentConfigured(true);
        }
    }

    useEffect(() => {
        if (secretExists.isFetched) isAgentConfigured();
    }, [secretExists.isFetched]);
    useEffect(() => {
        router.events.on('routeChangeComplete', isAgentConfigured)

        return () => {
            router.events.off('routeChangeComplete', isAgentConfigured);
        }
    }, []);

    if (secretExists.isPending) {
        return <LoadingOverlay
            visible={true}
            zIndex={1000}
        />;
    }

    return (agentConfigured && children);*/
}
