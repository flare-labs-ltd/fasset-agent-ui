import {
    Container,
    Title,
    Paper,
    Button,
    Text
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { modals } from '@mantine/modals';
import { useState, useRef } from 'react';
import VaultForm from '@/components/forms/VaultForm';
import { useCreateVault } from '@/api/agent';
import { showErrorNotification, showSucessNotification } from "@/hooks/useNotifications";
import { AgentSettingsConfig } from '@/types';

export default function AddVault() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    const formRef = useRef();
    const createVault = useCreateVault();

    const confirmModal = () => {
        const form = formRef.current.form();
        const status = form.validate();
        if (status.hasErrors) return;

        modals.openConfirmModal({
            title: t('add_agent_vault.confirm_modal.title'),
            children: (
                <Text size="sm" className="whitespace-pre-line">
                    {t('add_agent_vault.confirm_modal.content')}
                </Text>
            ),
            labels: {
                confirm: t('add_agent_vault.confirm_modal.confirm_button'),
                cancel: t('add_agent_vault.confirm_modal.cancel_button')
            },
            confirmProps: { color: 'red' },
            onConfirm: () => onSubmit(),
        });
    }

    const onSubmit = async() => {
        try {
            setIsLoading(true);
            const form = formRef.current.form();
            const data = form.getValues();
            if (!data.mintingFee.includes('%')) {
                data.mintingFee = `${data.mintingFee}%`;
            }
            if (!data.poolFeeShare.includes('%')) {
                data.poolFeeShare = `${data.poolFeeShare}%`;
            }

            const payload: AgentSettingsConfig = {
                poolTokenSuffix: data.poolTokenSuffix,
                vaultCollateralFtsoSymbol: data.vaultCollateralToken,
                fee: data.mintingFee,
                poolFeeShare: data.poolFeeShare,
                mintingVaultCollateralRatio: data.mintingVaultCollateralRatio,
                mintingPoolCollateralRatio: data.mintingPoolCollateralRatio,
                poolExitCollateralRatio: data.poolExitCollateralRatio,
                buyFAssetByAgentFactor: data.buyFAssetByAgentFactor,
                poolTopupCollateralRatio: data.poolTopUpCollateralRatio,
                poolTopupTokenPriceFactor: data.poolTopUpTokenPriceFactor
            }
            const response = await createVault.mutateAsync({
                fAssetSymbol: data.fAssetType,
                payload: payload
            });

            if (response.status === 'ERROR') {
                showErrorNotification(response.errorMessage);
                return;
            }

            showSucessNotification(t('add_agent_vault.success_message'));
        } catch (error) {
            showErrorNotification((error as any).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container
            size="sm"
        >
            <Button
                component={Link}
                href="/"
                variant="transparent"
                leftSection={<IconArrowLeft size={18} />}
                className="p-0 mb-3"
            >
                {t('add_agent_vault.back_button')}
            </Button>
            <Title order={2}>{t('add_agent_vault.title')}</Title>
            <Paper
                className="mt-5 p-4"
                withBorder
            >
                <VaultForm ref={formRef} />
                <div className="flex justify-end mt-5">
                    <Button
                        variant="outline"
                        loading={isLoading}
                        onClick={() => router.push('/')}
                        className="mr-4"
                    >
                        {t('add_agent_vault.discard_button')}
                    </Button>
                    <Button
                        loading={isLoading}
                        onClick={confirmModal}
                    >
                        {t('add_agent_vault.save_button')}
                    </Button>
                </div>
            </Paper>
        </Container>
    );
}

AddVault.protected = true;
