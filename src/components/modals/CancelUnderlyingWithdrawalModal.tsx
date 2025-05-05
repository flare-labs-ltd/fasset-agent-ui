import {
    Modal,
    Button,
    Text,
    Divider
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { showErrorNotification, showSucessNotification } from "@/hooks/useNotifications";
import { useCancelWithdraw } from "@/api/underlying";

interface ICancelUnderlyingWithdrawalModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

export default function CancelUnderlyingWithdrawalModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: ICancelUnderlyingWithdrawalModal) {
    const { t } = useTranslation();
    const cancelWithdraw = useCancelWithdraw();

    const onCancelWithdraw = async() => {
        try {
            await cancelWithdraw.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress
            })
            showSucessNotification(t('cancel_underlying_withdrawal_modal.success_message'));
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
            title={t('cancel_underlying_withdrawal_modal.title')}
            closeOnClickOutside={!cancelWithdraw.isPending}
            closeOnEscape={!cancelWithdraw.isPending}
            centered
        >
            <Text>{t('cancel_underlying_withdrawal_modal.description_label')}</Text>
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
                    onClick={onCancelWithdraw}
                    loading={cancelWithdraw.isPending}
                    fw={400}
                >
                    {t('cancel_underlying_withdrawal_modal.confirm_button')}
                </Button>
            </div>
        </Modal>
    )
}
