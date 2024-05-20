import {
    Title,
    Text,
    Paper,
    Loader,
    Button,
    Badge
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNotifications } from '@/api/agent';
import { useTranslation } from 'react-i18next';
import {BotAlert} from "@/types";
import classes from "@/styles/components/cards/AlertsCard.module.scss";

interface INotificationsCard {
    className?: string
}

const NOTIFICATIONS_REFETCH_INTERVAL = 30000;
const SHOW_ALL_BUTTON_LIMIT = 5;

export default function NotificationsCard({ className }: INotificationsCard) {
    const { t } = useTranslation();
    const [isShowAllButtonVisible, setIsShowAllButtonVisible] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false);
    const notifications = useNotifications();

    useEffect(() => {
        const botFetchInterval = setInterval(() => {
            notifications.refetch();
        }, NOTIFICATIONS_REFETCH_INTERVAL);

        return () => clearInterval(botFetchInterval);
    }, []);
    useEffect(() => {
        setIsShowAllButtonVisible(notifications.data?.length > SHOW_ALL_BUTTON_LIMIT);
    }, [notifications.isFetched]);


    //TODO: REMOVE
    return (
        <div className={`flex flex-col flex-nowrap w-full ${className}`}>
            <Paper
                withBorder
                className="flex flex-col p-4"
            >
                <Title order={4} className="mb-4">{t('notifications_card.title')}</Title>
                <Text>{t('notifications_card.no_notifications_label')}</Text>
            </Paper>
        </div>
    );

    return (
        <div className={`flex flex-col flex-nowrap w-full ${className}`}>
            <Paper
                withBorder
                className="flex flex-col p-4"
            >
                <Title order={4} className="mb-4">{t('notifications_card.title')}</Title>
                {notifications.isPending && <Loader className="ml-auto mr-auto" /> }
                {notifications?.data
                    ?.slice(0, showAll ? botAlerts?.data.length : 5)
                    ?.map((botAlert: BotAlert, index: number) => (
                        <div key={index} className="mt-4">
                            <div className="flex justify-between">
                                <Text c="gray">20.2.2024 10:42</Text>
                                <Badge
                                    className="uppercase"
                                    color="rgba(237, 242, 255, 1)"
                                    styles={{
                                        label: { color: 'var(--mantine-color-primary-6)' }
                                    }}
                                >
                                    TEXT
                                </Badge>
                            </div>
                            <Text size="sm">DESCRIPTION</Text>
                        </div>
                    ))}
                {notifications?.data?.length === 0 &&
                    <Text>{t('notifications_card.no_notifications_label')}</Text>
                }
            </Paper>
            {isShowAllButtonVisible &&
                <Button
                    variant="outline"
                    className="ml-auto mt-4"
                    onClick={() => setShowAll(!showAll)}
                >
                    {t('notifications_card.show_all_button')}
                </Button>
            }
        </div>
    );
}
