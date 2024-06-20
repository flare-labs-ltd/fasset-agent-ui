import {
    Text,
    Paper,
    MultiSelect,
    Tabs,
    rem,
    SimpleGrid,
    ScrollArea,
    Loader
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    IconBell,
    IconUrgent,
    IconNotification
} from "@tabler/icons-react";
import { useBotAlert } from "@/api/agent";
import { IBotAlert } from "@/types";
import { useRouter } from "next/router";
import { truncateString } from "@/utils";
import moment from "moment";
import classes from "@/styles/components/cards/AlertsCard.module.scss"

interface IAlertCard {
    className?: string
}

const ALERTS_REFETCH_INTERVAL = 3000;

const TAB_ALERTS = 'alerts';
const TAB_NOTIFICATIONS = 'notifications';

export default function AlertsCard({ className }: IAlertCard) {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [alerts, setAlerts] = useState<IBotAlert[]>([]);
    const botAlerts = useBotAlert();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady || !('level' in router.query)) return;
        const level = router?.query?.level as string;
        setSelectedFilter(level.split(','));
    }, [router?.isReady]);
    useEffect(() => {
        const botFetchInterval = setInterval(() => {
            botAlerts.refetch();
        }, ALERTS_REFETCH_INTERVAL);

        return () => clearInterval(botFetchInterval);
    }, []);
    useEffect(() => {
        if (botAlerts.data && botAlerts?.data?.length > 0) {
            setAlerts(selectedFilter?.length
                ? botAlerts?.data?.filter(alert => selectedFilter.includes(alert.alert.level))
                : botAlerts.data
            )
        }
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

        if (selectedFilter?.length > 0 && botAlerts.data && botAlerts?.data?.length > 0) {
            setAlerts(botAlerts?.data?.filter(alert => selectedFilter.includes(alert.alert.level)))
            return;
        }

        if (botAlerts.data != null) {
            setAlerts(botAlerts.data);
        }
    }, [selectedFilter]);

    return (
        <Paper
            className={`p-4 ${className}`}
            withBorder
        >
            <Tabs defaultValue={TAB_ALERTS}>
                <Tabs.List>
                    <Tabs.Tab
                        value={TAB_ALERTS}
                        leftSection={<IconUrgent style={{width: rem(15), height: rem(15)}} />}>
                        {t('alerts_card.tab_alerts_label')}
                    </Tabs.Tab>
                    <Tabs.Tab value={TAB_NOTIFICATIONS} leftSection={<IconNotification style={{width: rem(15), height: rem(15)}} />}>
                        {t('alerts_card.tab_notifications_label')}
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel
                    value={TAB_ALERTS}
                >
                    <ScrollArea
                        h={alerts.length > 0 ? 540 : 150}
                        scrollbarSize={6}
                        offsetScrollbars
                        scrollbars="y"
                    >
                        <MultiSelect
                            value={selectedFilter}
                            onChange={setSelectedFilter}
                            placeholder={t('alerts_card.alerts.filter_placeholder')}
                            clearable
                            data={[
                                { value: 'info', label: t('alerts_card.alerts.info_label') },
                                { value: 'danger', label: t('alerts_card.alerts.danger_label') },
                                { value: 'critical', label: t('alerts_card.alerts.critical_label') },
                            ]}
                            className="my-6 w-full md:w-3/4"
                        />
                        {botAlerts.isPending &&
                            <div className="flex justify-center">
                                <Loader />
                            </div>
                        }
                        {!botAlerts.isPending && alerts.length === 0 &&
                            <Text fw={700}>{t('alerts_card.alerts.no_alerts_label')}</Text>
                        }
                        <SimpleGrid
                            cols={{ base: 1, '414px': 2, '1512px': 1 }}
                            spacing="xl"
                            type="container"
                        >
                            {alerts.map((alert, index) => (
                                <div key={index}>
                                    <div
                                        className="flex items-center"
                                    >
                                        <div className={classes.alertItem}>
                                            <Text
                                                fw={400}
                                                size="sm"
                                                className="break-words capitalize"
                                            >
                                                {t('alerts_card.alerts.status_label', { status: alert.alert.level})}
                                            </Text>
                                            <div className="flex justify-between">
                                                {alert.date &&
                                                    <Text
                                                        size="sm"
                                                        c="var(--mantine-color-gray-6)"
                                                        className="break-words my-1 mr-3"
                                                    >
                                                        {moment(parseInt(alert.date)).format('DD.MM.YYYY HH:mm')}
                                                    </Text>
                                                }
                                                <Text
                                                    size="sm"
                                                    c="var(--mantine-color-gray-6)"
                                                    className="break-words my-1"
                                                >
                                                    {truncateString(alert.alert.address, 5, 5)} / Agent 1
                                                </Text>
                                            </div>
                                            <Text
                                                size="sm"
                                                c="var(--mantine-color-gray-6)"
                                                className="break-words"
                                            >
                                                {alert.alert.description}
                                            </Text>
                                        </div>
                                        <IconBell className="ml-3 flex-shrink-0" />
                                    </div>
                                </div>
                            ))}
                        </SimpleGrid>
                    </ScrollArea>
                </Tabs.Panel>
                <Tabs.Panel
                    value={TAB_NOTIFICATIONS}
                >
                    <ScrollArea
                        h={540}
                        scrollbarSize={6}
                        offsetScrollbars
                    >
                        <Text
                            fw={700}
                            className="mt-6"
                        >{t('alerts_card.notifications.no_notifications_label')}</Text>
                    </ScrollArea>
                </Tabs.Panel>
            </Tabs>
        </Paper>
    );
}
