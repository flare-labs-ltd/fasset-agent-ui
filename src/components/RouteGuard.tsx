import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSecretExists } from "@/api/agent";
import { LoadingOverlay } from "@mantine/core";
import {useWeb3} from "@/hooks/useWeb3";

export default function AuthGuard({ children }: { children: React.ReactNode}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const { isConnected, isInitializing, isAuthenticated } = useWeb3();

    const isWalletConnected = async(url?: string) => {
        console.log({
            isConnected: isConnected,
            isInitializing: isInitializing,
            isAuthenticated: isAuthenticated,
        })
        if (isInitializing) return;

        if (!isAuthenticated) {
            await router.push('/login');
        } else if (isAuthenticated && !isConnected && router.pathname !== '/connect') {
            await router.push('/connect');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        isWalletConnected(undefined);
    }, [isInitializing, isConnected, isAuthenticated]);

    useEffect(() =>     {
        router.events.on('routeChangeComplete', isWalletConnected)

        return () => {
            router.events.off('routeChangeComplete', isWalletConnected);
        }
    }, []);

    if (isLoading) {
        return <LoadingOverlay
            visible={true}
            zIndex={1000}
            className="fixed"
        />;
    }

    return children;
}
