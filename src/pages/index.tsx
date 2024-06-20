import {
    Container,
    Title
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import AlertsCard from '@/components/cards/AlertsCard';
import AgentBotsCard from '@/components/cards/AgentBotsCard';
import ManagementAddressCard from '@/components/cards/ManagementAddressCard';
import VaultsCard from '@/components/cards/VaultsCard';

export default function Dashboard() {
    const { t } = useTranslation();

    return (
        <Container
            fluid
            className="px-0 sm:px-6 w-full"
        >
            <div className="flex flex-col lg:flex-row w-full">
                <div className="lg:w-3/5 w-full mr-8">
                    <Title
                        order={1}
                        className="mb-3"
                    >
                        {t('dashboard.title')}
                    </Title>
                    <ManagementAddressCard />
                    <Title
                        order={1}
                        className="mt-10 mb-3"
                    >
                        {t('dashboard.agent_title')}
                    </Title>
                    <AgentBotsCard />
                </div>
                <div className="hidden lg:block w-full lg:w-2/5">
                    <Title
                        order={1}
                        className="mb-3"
                    >
                        {t('dashboard.alerts_title')}
                    </Title>
                    <AlertsCard />
                </div>
            </div>
            <div className="mt-10">
                <Title
                    order={1}
                    className="mb-3"
                >
                    {t('dashboard.vaults_title')}
                </Title>
                <VaultsCard />
            </div>
            <div className="block lg:hidden w-full mt-10">
                <Title
                    order={1}
                    className="mb-3"
                >
                    {t('dashboard.alerts_title')}
                </Title>
                <AlertsCard />
            </div>
        </Container>
    );
}

Dashboard.protected = true;
