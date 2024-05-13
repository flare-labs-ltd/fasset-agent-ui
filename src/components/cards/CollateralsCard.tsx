import {
    Title,
    Paper,
    Text,
    Loader,
    Badge
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Collateral } from '@/types';
import { useBotStatus, useCollaterals } from '@/api/agent';

interface ICollateralsCard {
    className?: string
}

export default function CollateralsCard({ className }: ICollateralsCard) {
    const { t } = useTranslation();
    const collaterals = useCollaterals();
    const botStatus = useBotStatus();

    return (
        <Paper
            className={`p-4 ${className}`}
            withBorder
        >
            <div className="flex justify-between items-center">
                <Title order={4}>{t('collaterals_card.title')}</Title>
                {botStatus.isFetched &&
                    <Badge
                        size="lg"
                        color={botStatus.data ? 'rgba(237, 242, 255, 1)' : 'red'}
                        styles={{
                            label: { color: botStatus.data ? 'var(--mantine-color-primary-6)' : 'white' }
                        }}
                    >
                        {t(botStatus.data ? 'collaterals_card.agent_online_label' : 'collaterals_card.agent_offline_label')}
                    </Badge>
                }
            </div>
            <div className="flex flex-wrap md:flex-nowrap mt-4">
                {collaterals.isPending && <Loader className="ml-auto mr-auto" /> }
                {!collaterals.isPending && collaterals?.data?.map((collateral: Collateral, index: number) => (
                    <div
                        key={index}
                        className={`border-t-2 border-gray-300 w-full mt-4 md:mt-0 ${index < collaterals.data.length - 1 ? 'mr-5' : ''}`}
                    >
                        <Text c="gray">{collateral.symbol}</Text>
                        <Text fw={700}>{Number(collateral.balance).toLocaleString('de-DE', { minimumFractionDigits: 2 })}</Text>
                    </div>
                ))}
            </div>
        </Paper>
    );
}
