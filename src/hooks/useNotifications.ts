import { notifications } from '@mantine/notifications';
import i18next  from '@/i18n/config';

export function showSucessNotification(message: string) {
    notifications.show({
        title: i18next.t('notifications.success_title'),
        message: message,
        color: 'green'
    })
}

export function showErrorNotification(message: string) {
    notifications.show({
        title: i18next.t('notifications.error_title'),
        message: message,
        color: 'red'
    })
}
