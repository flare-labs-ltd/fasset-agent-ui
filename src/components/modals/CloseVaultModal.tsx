import {
    Modal,
    Button,
    Text,
    Divider
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { showErrorNotification, showSucessNotification } from "@/hooks/useNotifications";
import { useCloseVault } from "@/api/agentVault";

interface ICloseVaultModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

export default function CloseVaultModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: ICloseVaultModal) {
    const closeVault = useCloseVault();
    const { t } = useTranslation();

    const onCloseVaultClick = async() => {
        try {
            await closeVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress
            })
            showSucessNotification(t('close_vault_modal.success_message'));
            onClose();
        } catch (error) {
            showErrorNotification((error as any).response.data.message);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('close_vault_modal.title')}
            closeOnClickOutside={!closeVault.isPending}
            closeOnEscape={!closeVault.isPending}
            centered
        >
            <Text className="whitespace-pre-line">{t('close_vault_modal.description_label')}</Text>
            <Divider
                className="my-8"
                styles={{
                    root: {
                        marginLeft: '-2rem',
                        marginRight: '-2rem'
                    }
                }}
            />
            <div className="flex mt-5">
                <Button
                    variant="default"
                    onClick={onClose}
                    className="ml-auto mr-3"
                    loading={closeVault.isPending}
                    fw={400}
                >
                    {t('close_vault_modal.cancel_button')}
                </Button>
                <Button
                    color="red"
                    onClick={onCloseVaultClick}
                    loading={closeVault.isPending}
                    fw={400}
                >
                    {t('close_vault_modal.confirm_button')}
                </Button>
            </div>
        </Modal>
    );
}
