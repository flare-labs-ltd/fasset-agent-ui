import {
    Modal,
    Button,
    Text
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import { useDeactivateVault } from '@/api/agent';
import { useRouter } from 'next/router';

interface IDeactivateVaultModal {
    opened: boolean;
    onClose: () => void;
}

export default function DeactivateVaultModal({ opened, onClose }: IDeactivateVaultModal) {
    const deactivateVault = useDeactivateVault();
    const { t } = useTranslation();

    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;

    const onDeactivateVaultClick = async() => {
        try {
            await deactivateVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress
            })
            showSucessNotification(t('deactivate_vault_modal.success_message'));
            onClose();
        } catch (error) {
            showErrorNotification((error as any).response.data.message);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('deactivate_vault_modal.title')}
            closeOnClickOutside={!deactivateVault.isPending}
            closeOnEscape={!deactivateVault.isPending}
            centered
        >
            <Text className="whitespace-pre-line">{t('deactivate_vault_modal.description_label')}</Text>
            <div className="flex mt-5">
                <Button
                    variant="default"
                    onClick={onClose}
                    className="ml-auto mr-3"
                    loading={deactivateVault.isPending}
                >
                    {t('deactivate_vault_modal.cancel_button')}
                </Button>
                <Button
                    color="red"
                    onClick={onDeactivateVaultClick}
                    loading={deactivateVault.isPending}
                >
                    {t('deactivate_vault_modal.confirm_button')}
                </Button>
            </div>
        </Modal>
    );
}
