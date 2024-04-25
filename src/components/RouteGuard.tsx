import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSecretExists } from '@/api/agent';
import { LoadingOverlay } from '@mantine/core';
export default function AuthGuard({ children }: { children: React.ReactNode}) {
    const [agentConfigured, setAgentConfigured] = useState<boolean>(false);
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

    return (agentConfigured && children);
}
