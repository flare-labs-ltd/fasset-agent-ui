import {
    Container,
    Title,
    Text,
    Button,
    Card
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/hooks/useWeb3';
import { useConnectWalletModal } from '@/hooks/useEthereumLogin';
import { useSecretExists, useWorkAddress } from "@/api/agent";

export default function Setup() {
    const router = useRouter();
    const { openConnectWalletModal } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();
    const secretExists = useSecretExists();
    const workAddress = useWorkAddress(secretExists.data === true);

    useEffect(() => {
        if (secretExists.data && workAddress.data) {
            router.push('/');
        }
    }, [secretExists, workAddress]);

    const onSetupAgentClick = async() => {
        if (account) {
            router.push('/configure');
        } else {
            openConnectWalletModal((wallet) => {
                if (wallet) router.push('/configure');
            });
        }
    };

    return (
        <Container
            size="xs"
            className="flex flex-col items-center text-center"
        >
            <Title order={2}>{t('setup.title')}</Title>
            <Text size="sm" color="gray">{t('setup.subtitle')}</Text>
            <Card
                shadow="sm"
                className="mt-8 w-full"
            >
                <Button
                    variant="filled"
                    onClick={onSetupAgentClick}
                >
                    {t('setup.setup_agent_button')}
                </Button>
            </Card>
        </Container>
    );
}
