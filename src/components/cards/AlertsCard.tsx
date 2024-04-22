import {
    Title,
    Text,
    Paper,
    Loader,
    Button
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconBell
} from '@tabler/icons-react';
import { useBotAlert } from '@/api/agent';
import { BotAlert } from '@/types';
import classes from '@/styles/components/cards/AlertsCard.module.scss';

interface IAlertCard {
    className?: string
}

const ALERT_REFETCH_INTERVAL = 30000;
const SHOW_ALL_BUTTON_LIMIT = 5;

export default function AlertsCard({ className }: IAlertCard) {
    const { t } = useTranslation();
    const [isShowAllButtonVisible, setIsShowAllButtonVisible] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false);
    const botAlerts = useBotAlert();

    useEffect(() => {
        const botFetchInterval = setInterval(() => {
            botAlerts.refetch();
        }, ALERT_REFETCH_INTERVAL);

        return () => clearInterval(botFetchInterval);
    }, []);
    useEffect(() => {
        setIsShowAllButtonVisible(botAlerts.data?.length > SHOW_ALL_BUTTON_LIMIT);
    }, [botAlerts.isFetched]);

    return (
        <div className={`flex flex-col flex-nowrap w-full ${className}`}>
            <Paper
                withBorder
                className="flex flex-col p-4"
            >
                <Title order={4} className="mb-8">{t('alerts_card.title')}</Title>
                {botAlerts.isPending && <Loader className="ml-auto mr-auto" /> }
                {botAlerts?.data
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
            </Paper>
            {isShowAllButtonVisible &&
                <Button
                    variant="outline"
                    className="ml-auto mt-4"
                    onClick={() => setShowAll(!showAll)}
                >
                    {t('alerts_card.show_all_button')}
                </Button>
            }
        </div>
    );
}
