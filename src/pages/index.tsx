import {
    Container,
    Title,
    Button,
} from '@mantine/core';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import AlertsCard from '@/components/cards/AlertsCard';
import CollateralsCard from '@/components/cards/CollateralsCard';
import VaultsCard from '@/components/cards/VaultsCard';

export default function Dashboard() {
    const { t } = useTranslation();

    return (
        <Container
            size="lg"
        >
            <div>
                <div className="flex items-center w-full">
                    <Title order={1}>{t('dashboard.agent_title')}</Title>
                    <Button
                        component={Link}
                        href="/configure"
                        className="ml-auto"
                    >
                        {t('dashboard.configuration_button')}
                    </Button>
                </div>
            </div>
            <CollateralsCard className="mt-5 border-primary" />
            <div className="flex flex-wrap md:flex-nowrap mt-5">
                <AlertsCard className="mr-0 md:mr-10" />
                <AlertsCard className="mt-5 md:mt-0" />
            </div>
            <div className="mt-10">
                <div className="flex items-center w-full">
                    <Title order={1}>{t('dashboard.vaults_title')}</Title>
                    <Button
                        component={Link}
                        href="/vault/add"
                        className="ml-auto"
                    >
                        {t('dashboard.add_vault_button')}
                    </Button>
                </div>
                <VaultsCard className="mt-5 border-primary" />
            </div>
        </Container>
    );
}

Dashboard.protected = true;
