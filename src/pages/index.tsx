import {
    Container,
    Title,
    Text,
    Button,
    Card
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/components/elements/connect-wallet/hooks/useWeb3';
import { useConnectWalletModal } from '@/components/elements/connect-wallet/hooks/useEthereumLogin';
import { useEffect } from "react";
export default function Home(): JSX.Element {
    const router = useRouter();
    const { openConnectWalletModal, modalStatus } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();

    useEffect((): void => {
        if (account) {
            router.push('/agent-configuration');
        }
    }, [modalStatus]);

    const onSetupAgentClick = () => {
        if (account) {
            router.push('/agent-configuration');
        } else {
            openConnectWalletModal();
        }
    };

    return (
        <Container
            size="xs"
            className="flex flex-col items-center text-center"
        >
            <Title order={2}>{t('home.title')}</Title>
            <Text size="sm" color="gray">{t('home.subtitle')}</Text>
            <Card
                shadow="sm"
                className="mt-8 w-full"
            >
                <Button
                    variant="filled"
                    onClick={onSetupAgentClick}
                >
                    {t('home.setup_agent_button')}
                </Button>
            </Card>
        </Container>
    );
}
