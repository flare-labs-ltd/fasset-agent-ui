import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSecretExists } from "@/api/agent";
import { LoadingOverlay } from "@mantine/core";
import {useWeb3} from "@/hooks/useWeb3";

export default function AuthGuard({ children }: { children: React.ReactNode}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [checkSecret, setCheckSecret] = useState<boolean>(false);
    const router = useRouter();
    const secretExists = useSecretExists(false);
    const { isConnected, isInitializing } = useWeb3();

    const isAgentConfigured = async()  => {
        const response = await secretExists.refetch();
        if (response.data === false) {
            await router.push('/configure');
        }

        setCheckSecret(false);
    }

    const isWalletConnected = async(url?: string) => {
        if (isInitializing) return;

        if (!isConnected) {
            await router.push('/connect');
        } else if (url !== '/configure') {
            setCheckSecret(true);
            isAgentConfigured();
        }

        setIsLoading(false);
    };

    useEffect(() => {
        isWalletConnected(undefined);
    }, [isInitializing, isConnected]);

    useEffect(() =>     {
        router.events.on('routeChangeComplete', isWalletConnected)

        return () => {
            router.events.off('routeChangeComplete', isWalletConnected);
        }
    }, []);

    if (isLoading || checkSecret) {
        return <LoadingOverlay
            visible={true}
            zIndex={1000}
            className="fixed"
        />;
    }

    return children;
}
