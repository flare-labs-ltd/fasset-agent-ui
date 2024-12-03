import {
    Text,
    Paper,
    MultiSelect,
    Tabs,
    rem,
    SimpleGrid,
    ScrollArea,
    Loader,
    Badge,
    Pagination
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    IconBell,
    IconUrgent,
    IconNotification,
    IconCircle
} from "@tabler/icons-react";
import { useBotAlert, useNotifications } from "@/api/agent";
import { IBotAlert } from "@/types";
import { useRouter } from "next/router";
import { truncateString } from "@/utils";
import moment from "moment";
import { useNotificationStore } from "@/store/notification";
import classes from "@/styles/components/cards/AlertsCard.module.scss"

interface IAlertCard {
    className?: string
}

const ALERTS_REFETCH_INTERVAL = 30000;
const NOTIFICATIONS_REFETCH_INTERVAL = 60000;
const ALERTS_PER_PAGE = 10;

const TAB_ALERTS = 'alerts';
const TAB_NOTIFICATIONS = 'notifications';

export default function AlertsCard({ className }: IAlertCard) {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [alerts, setAlerts] = useState<IBotAlert[]>([]);
    const [alertsOffset, setAlertsOffset] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const [activeTab, setActiveTab] = useState<string>(TAB_ALERTS);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);

    const botAlerts = useBotAlert(ALERTS_PER_PAGE, alertsOffset, selectedFilter, currentPage !== undefined);
    const notifications = useNotifications();
    const router = useRouter();
    const { setLatestNotificationId, latestNotificationId } = useNotificationStore();

    useEffect(() => {
        if (!router.isReady) return;

        if ('level' in router.query) {
            const level = router?.query?.level as string;
            setSelectedFilter(level.split(','));
        }

        const page = 'page' in router.query ? Number(router.query.page) : 1;
        setCurrentPage(page);
        setAlertsOffset((page - 1) * ALERTS_PER_PAGE);
    }, [router?.isReady]);

    useEffect(() => {
        const botFetchInterval = setInterval(() => {
            botAlerts.refetch();
        }, ALERTS_REFETCH_INTERVAL);
        const notificationFetchInterval = setInterval(() => {
            notifications.refetch();
        }, NOTIFICATIONS_REFETCH_INTERVAL);

        return () => {
            clearInterval(botFetchInterval);
            clearInterval(notificationFetchInterval);
        }
    }, []);

    useEffect(() => {
        if (botAlerts.data && botAlerts?.data?.alerts.length > 0) {
            setAlerts(botAlerts.data.alerts);
        }
    }, [botAlerts.data]);

    useEffect(() => {
        if (!notifications.data || notifications?.data?.length === 0) return;

        const id = notifications.data[0].id;
        if (!latestNotificationId || id > latestNotificationId) {
            setHasUnreadNotifications(true);
        }
    }, [notifications.data]);

    useEffect(() => {
        if (selectedFilter.length > 0) {
            const page = router.query?.page ? Number(router.query?.page) : 1;
            setCurrentPage(page);
            setAlertsOffset((page - 1) * ALERTS_PER_PAGE);
            router.push(
                {
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        page: page,
                        level: selectedFilter.join(',')
                    }
                },
                undefined,
                { shallow: true }
            )
        }
    }, [selectedFilter]);

    const onNotificationTabClick = () => {
        if (!notifications.data || notifications?.data?.length === 0) return;

        const id = notifications.data[0].id;
        setLatestNotificationId(id);
        setHasUnreadNotifications(false);
    }

    const setPagination = (page: number) => {
        setCurrentPage(page);
        setAlertsOffset((page - 1) * ALERTS_PER_PAGE);
        router.push(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    page: page
                }
            },
            undefined,
            { shallow: true }
        )
    }

    const onChangeFilters = async (values: string[]) => {
        const query = { ...router.query };
        if (values.length === 0 && 'level' in query) {
            delete query.level;
        }

        await router.push(
            {
                pathname: router.pathname,
                query: {
                    ...query,
                    page: 1
                }
            },
            undefined,
            { shallow: true }
        )
        setSelectedFilter(values);
    }

    return (
        <div className="flex flex-col">
            <Paper
                className={`p-4 ${className}`}
                withBorder
            >
                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                >
                    <Tabs.List>
                        <Tabs.Tab
                            value={TAB_ALERTS}
                            leftSection={<IconUrgent style={{width: rem(15), height: rem(15)}} />}>
                            {t('alerts_card.tab_alerts_label')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={TAB_NOTIFICATIONS}
                            leftSection={<IconNotification style={{width: rem(15), height: rem(15)}} />}
                            onClick={onNotificationTabClick}
                        >
                            <div>
                                {t('alerts_card.tab_notifications_label')}
                                {hasUnreadNotifications &&
                                    <IconCircle
                                        style={{width: rem(15), height: rem(15)}}
                                        className={classes.notificationIndicatorIcon}
                                    />
                                }
                            </div>
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
                                onChange={onChangeFilters}
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
                                                    {t('alerts_card.alerts.status_label', { status: alert.level})}
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
                                                        {truncateString(alert.address, 5, 5)} / Agent 1
                                                    </Text>
                                                </div>
                                                <Text
                                                    size="sm"
                                                    c="var(--mantine-color-gray-6)"
                                                    className="break-words"
                                                >
                                                    {alert.description}
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
                            h={notifications.data && notifications.data?.length > 0 ? 540 : 150}
                            scrollbarSize={6}
                            offsetScrollbars
                            scrollbars="y"
                        >
                            {notifications.isPending &&
                                <div className="flex justify-center">
                                    <Loader className="mt-6" />
                                </div>
                            }
                            {!notifications.isPending && notifications?.data?.length === 0 &&
                                <Text
                                    fw={700}
                                    className="mt-6"
                                >
                                    {t('alerts_card.notifications.no_notifications_label')}
                                </Text>
                            }
                            <SimpleGrid
                                cols={1}
                                type="container"
                                className="mt-5"
                            >
                                {notifications?.data?.map((notification, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between">
                                            <Text
                                                size="sm"
                                                c="var(--mantine-color-gray-6)"
                                            >
                                                {moment(notification.time).format('DD.MM.YYYY HH:mm')}
                                            </Text>
                                            <Badge
                                                color="rgba(36, 36, 37, 0.06)"
                                                radius="xs"
                                                className="uppercase text-black"
                                                fw={400}
                                            >
                                                {t('alerts_card.notifications.all_agents_label')}
                                            </Badge>
                                        </div>
                                        <Text
                                            size="sm"
                                            c="var(--mantine-color-gray-6)"
                                            className="mt-2"
                                        >
                                            {notification.messages}
                                        </Text>
                                    </div>
                                ))}
                            </SimpleGrid>
                        </ScrollArea>
                    </Tabs.Panel>
                </Tabs>
            </Paper>
            {botAlerts.data && botAlerts.data?.count > 0 && activeTab === TAB_ALERTS &&
                <Pagination
                    total={Math.ceil(botAlerts.data?.count / ALERTS_PER_PAGE)}
                    className="mt-5 ml-auto"
                    size="sm"
                    value={currentPage}
                    onChange={setPagination}
                />
            }
        </div>
    );
}
