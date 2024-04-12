import {
    Container,
    Title,
    Text,
    Button,
    Card
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import MainLayout from "@/components/layouts/MainLayout";
import { useWeb3 } from '@/lib/connect-wallet/hooks/useWeb3';
import { useConnectWalletModal } from '@/lib/connect-wallet/hooks/useEthereumLogin';

export default function Home(): JSX.Element {
    const { openConnectWalletModal } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();

    const onSetupAgentClick = () => {
        if (account) {

        } else {
            openConnectWalletModal();
        }
    };

    return (
        <MainLayout>
            <Container
                size="xs"
                className="flex flex-col items-center text-center"
            >
                <Title order={2}>{t('home.title')}</Title>
                <Text size="sm">{t('home.subtitle')}</Text>
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
        </MainLayout>
    );
}
