import {
    Title,
    Paper,
    Text,
    Loader,
    Badge,
    rem,
    Input
} from '@mantine/core';
import { IconCopy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Collateral } from '@/types';
import { useBotStatus, useCollaterals, useWorkAddress } from '@/api/agent';
import { useEffect } from "react";

interface ICollateralsCard {
    className?: string
}

const COLLATERALS_FETCH_INTERVAL = 60000;

export default function CollateralsCard({ className }: ICollateralsCard) {
    const { t } = useTranslation();
    const collaterals = useCollaterals();
    const botStatus = useBotStatus();
    const workAddress = useWorkAddress();

    useEffect(() => {
        const collateralsFetchInterval = setInterval(() => {
            collaterals.refetch();
        }, COLLATERALS_FETCH_INTERVAL);

        return () => clearInterval(collateralsFetchInterval);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <Paper
            className={`p-4 ${className}`}
            withBorder
        >
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-baseline">
                    <Title
                        order={4}
                        className="mr-2 flex-shrink-0"
                    >
                        {t('collaterals_card.title')}:
                    </Title>
                    <Input
                        value={workAddress.data || ''}
                        disabled={true}
                        variant="filled"
                        className="min-w-full"
                        rightSectionPointerEvents="all"
                        rightSection={
                            (!workAddress.isPending ? workAddress.isRefetching : false)
                                ? <Loader size="xs" />
                                : workAddress.data && <IconCopy
                                color="black"
                                style={{ width: rem(20), height: rem(20) }}
                                onClick={() => copyToClipboard(workAddress.data)}
                            />
                        }
                        styles={{
                            section: { cursor: 'pointer' },
                            input: { marginRight: '2rem', color: 'var(--mantine-color-dark-text)', opacity: 1 }
                        }}
                    />
                </div>

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
                        <Text fw={700}>{collateral.balance}</Text>
                    </div>
                ))}
            </div>
        </Paper>
    );
}
