import {
    Modal,
    Button,
    Text,
    Divider
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useCancelReturnFromCoreVault } from "@/api/agentVault";
import { showErrorNotification, showSucessNotification } from "@/hooks/useNotifications";

interface ICancelWithdrawFromCoreVaultModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

export default function CancelWithdrawFromCoreVaultModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: ICancelWithdrawFromCoreVaultModal) {
    const { t } = useTranslation();
    const cancelReturnFromCoreVault = useCancelReturnFromCoreVault();

    const onCancelTransferToCoreVault = async() => {
        try {
            await cancelReturnFromCoreVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress
            })
            showSucessNotification(t('cancel_withdraw_from_core_vault_modal.success_message'));
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
            title={t('cancel_withdraw_from_core_vault_modal.title')}
            closeOnClickOutside={!cancelReturnFromCoreVault.isPending}
            closeOnEscape={!cancelReturnFromCoreVault.isPending}
            centered
        >
            <Text>{t('cancel_withdraw_from_core_vault_modal.description_label')}</Text>
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
                    loading={cancelReturnFromCoreVault.isPending}
                    fw={400}
                >
                    {t('cancel_withdraw_from_core_vault_modal.confirm_button')}
                </Button>
            </div>
        </Modal>
    )
}
