import {
    Modal,
    Button,
    Text,
    Divider
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useCancelTransferToCoreVault } from "@/api/agentVault";
import { showErrorNotification, showSucessNotification } from "@/hooks/useNotifications";

interface ICancelTransferToCoreVaultModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

export default function CancelTransferToCoreVaultModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: ICancelTransferToCoreVaultModal) {
    const { t } = useTranslation();
    const cancelTransferToCoreVault = useCancelTransferToCoreVault();

    const onCancelTransferToCoreVault = async() => {
        try {
            await cancelTransferToCoreVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress
            })
            showSucessNotification(t('cancel_transfer_to_core_vault_modal.success_message'));
            onClose();
        } catch (error) {
            showErrorNotification((error as any).response.data.message);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size={600}
            title={t('cancel_transfer_to_core_vault_modal.title')}
            closeOnClickOutside={!cancelTransferToCoreVault.isPending}
            closeOnEscape={!cancelTransferToCoreVault.isPending}
            centered
        >
            <Text>{t('cancel_transfer_to_core_vault_modal.description_label')}</Text>
            <Divider
                className="my-8"
                styles={{
                    root: {
                        marginLeft: '-2rem',
                        marginRight: '-2rem'
                    }
                }}
            />
            <div className="flex mt-5 justify-end">
                <Button
                    onClick={onCancelTransferToCoreVault}
                    loading={cancelTransferToCoreVault.isPending}
                    fw={400}
                >
                    {t('cancel_transfer_to_core_vault_modal.confirm_button')}
                </Button>
            </div>
        </Modal>
    )
}
