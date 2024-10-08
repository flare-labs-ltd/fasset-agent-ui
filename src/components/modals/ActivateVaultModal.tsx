import {
    Modal,
    Button,
    Text,
    Divider
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { showErrorNotification, showSucessNotification } from "@/hooks/useNotifications";
import { useActivateVault } from "@/api/agent";

interface IActivateVaultModal {
    opened: boolean;
    onClose: () => void;
    fAssetSymbol: string;
    agentVaultAddress: string;
}

export default function ActivateVaultModal({ opened, onClose, fAssetSymbol, agentVaultAddress }: IActivateVaultModal) {
    const activateVault = useActivateVault();
    const { t } = useTranslation();

    const onActivateVaultClick = async() => {
        try {
            await activateVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress
            })
            showSucessNotification(t('activate_vault_modal.success_message'));
            onClose();
        } catch (error) {
            showErrorNotification((error as any).response.data.message);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('activate_vault_modal.title')}
            closeOnClickOutside={!activateVault.isPending}
            closeOnEscape={!activateVault.isPending}
            centered
        >
            <Text>{t('activate_vault_modal.description_label')}</Text>
            <Text
                size="xs"
                className="mt-3"
            >
                {t('activate_vault_modal.minimal_collateral_for_minting_label')}
            </Text>
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
                    loading={activateVault.isPending}
                    fw={400}
                >
                    {t('activate_vault_modal.cancel_button')}
                </Button>
                <Button
                    color="red"
                    onClick={onActivateVaultClick}
                    loading={activateVault.isPending}
                    fw={400}
                >
                    {t('activate_vault_modal.confirm_button')}
                </Button>
            </div>
        </Modal>
    );
}
