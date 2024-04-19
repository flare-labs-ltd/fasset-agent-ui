import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSecretExists } from '@/api/agent';

export default function AuthGuard({ children }: { children: React.ReactNode}) {
    const [agentConfigured, setAgentConfigured] = useState<boolean>(false);
    const router = useRouter();
    const secretExists = useSecretExists();

    const isAgentConfigured = ()  => {

        if (secretExists.data) {
            setAgentConfigured(false);
            router.push('/');
        } else {
            setAgentConfigured(true);
        }
    }

    useEffect(() => {
        router.events.on('routeChangeComplete', isAgentConfigured)

        return () => {
            router.events.off('routeChangeComplete', isAgentConfigured);
        }
    }, []);
    useEffect(() => {
        if (!secretExists.isFetched) return;
        isAgentConfigured();
    }, [secretExists.isFetched]);

    return (agentConfigured && children);
}
