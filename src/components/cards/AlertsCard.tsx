import {
    Title,
    Text,
    Paper,
    Loader,
    Button,
    MultiSelect
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconBell
} from '@tabler/icons-react';
import { useBotAlert } from '@/api/agent';
import { BotAlert } from '@/types';
import classes from '@/styles/components/cards/AlertsCard.module.scss';
import { useRouter } from 'next/router';

interface IAlertCard {
    className?: string
}

const ALERTS_REFETCH_INTERVAL = 30000;
const SHOW_ALL_BUTTON_LIMIT = 5;

export default function AlertsCard({ className }: IAlertCard) {
    const { t } = useTranslation();
    const [isShowAllButtonVisible, setIsShowAllButtonVisible] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [alerts, setAlerts] = useState<BotAlert[]>([]);
    const [showAll, setShowAll] = useState<boolean>(false);
    const botAlerts = useBotAlert();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady || !('level' in router.query)) return;
        setSelectedFilter(router.query.level.split(','));
    }, [router?.isReady]);
    useEffect(() => {
        const botFetchInterval = setInterval(() => {
            botAlerts.refetch();
        }, ALERTS_REFETCH_INTERVAL);

        return () => clearInterval(botFetchInterval);
    }, []);
    useEffect(() => {
        if (botAlerts?.data?.length > 0) {
            setAlerts(selectedFilter?.length
                ? botAlerts?.data?.filter((alert: BotAlert) => selectedFilter.includes(alert.level))
                : botAlerts.data
            )
        }
        setIsShowAllButtonVisible(botAlerts.data?.length > SHOW_ALL_BUTTON_LIMIT);
    }, [botAlerts.data]);
    useEffect(() => {
        if (selectedFilter?.length > 0) {
            router.push(
                {
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        level: selectedFilter.join(',')
                    }
                },
                undefined,
                { shallow: true }
            )
        } else if ('level' in router.query) {
            delete router.query.level;
            router.push(
                {
                    pathname: router.pathname,
                    query: router.query,
                },
                undefined,
                { shallow: true }
            );
        }

        if (selectedFilter?.length > 0 && botAlerts?.data?.length > 0) {
            setAlerts(botAlerts?.data?.filter((alert: BotAlert) => selectedFilter.includes(alert.level)))
            return;
        }

        if (botAlerts.data != null) {
            setAlerts(botAlerts.data);
        }
    }, [selectedFilter]);

    return (
        <div className={`flex flex-col flex-nowrap w-full ${className} relative`}>
            <Paper
                withBorder
                className={`${classes.alertsContainer} flex flex-col p-4 relative ${showAll ? 'overflow-y-scroll' : ''}`}
            >
                <Title order={4} className="mb-4">{t('alerts_card.title')}</Title>
                <MultiSelect
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                    placeholder={t('alerts_card.filter_placeholder')}
                    clearable
                    data={[
                        { value: 'info', label: t('alerts_card.info_label') },
                        { value: 'danger', label: t('alerts_card.danger_label') },
                        { value: 'critical', label: t('alerts_card.critical_label') },
                    ]}
                    className="mb-4"
                    classNames={{
                        pill: classes.pill
                    }}
                />
                {botAlerts.isPending && <Loader className="ml-auto mr-auto" /> }
                {alerts
                    ?.slice(0, showAll ? botAlerts?.data.length : 5)
                    ?.map((botAlert: BotAlert, index: number) => (
                        <div key={index} className="mt-4">
                            <Text fw={500} size="md">{botAlert.title}</Text>
                            <div className="flex">
                                <Text
                                    size="sm"
                                    c="gray"
                                    className={classes.alertText}
                                >
                                    {botAlert.description}
                                </Text>
                                <IconBell className="ml-3 flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                {alerts?.length === 0 &&
                    <Text>{t('alerts_card.no_alerts_label')}</Text>
                }
            </Paper>
            {isShowAllButtonVisible &&
                <Button
                    variant="outline"
                    className="ml-auto mt-4"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? t('alerts_card.show_less_button') : t('alerts_card.show_all_button')}
                </Button>
            }
        </div>
    );
}
