import {
    Container,
    Title,
    Paper,
    Button,
    Text,
    Loader
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import AlertsCard from '@/components/cards/AlertsCard';
import { useCollaterals } from '@/api/agent';
import { Collateral } from '@/types';

export default function Dashboard() {
    const { t } = useTranslation();
    const collaterals = useCollaterals();

    return (
        <Container
            size="lg"
        >
            <div className="flex justify-between">
                <Title order={2}>{t('dashboard.agent_title')}</Title>
                <Button
                    component={Link}
                    href="/configure"
                >
                    {t('dashboard.configuration_button')}
                </Button>
            </div>

            <Paper
                className="mt-5 p-4 border-primary"
                withBorder
            >
                <Title order={4}>{t('dashboard.working_address_card.title')}</Title>
                    <div className="flex flex-wrap md:flex-nowrap mt-4">
                        {collaterals.isPending && <Loader className="ml-auto mr-auto" /> }
                        {collaterals?.data?.map((collateral: Collateral, index: number) => (
                            <div
                                key={index}
                                className={`border-t-2 border-gray-300 w-full mt-4 md:mt-0 ${index < collaterals.data.length - 1 ? 'mr-5' : ''}`}
                            >
                                <Text c="gray">{collateral.symbol}</Text>
                                <Text fw={700}>{collateral.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</Text>
                            </div>
                        ))}
                    </div>
            </Paper>
            <div className="flex flex-wrap md:flex-nowrap mt-5">
                <AlertsCard className="mr-0 md:mr-10" />
                <AlertsCard className="mt-5 md:mt-0" />
            </div>
        </Container>
    );
}

Dashboard.protected = true;
