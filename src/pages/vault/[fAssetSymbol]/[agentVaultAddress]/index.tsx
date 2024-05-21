import {
    Container,
    Title,
    Paper,
    Button,
    Text,
    LoadingOverlay
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { modals } from '@mantine/modals';
import { useVaultInfo, useUpdateVault } from '@/api/agent';
import VaultForm from '@/components/forms/VaultForm';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import AgentVaultOperationsCard from '@/components/cards/AgentVaultOperationsCard';
import { AgentSettingsDTO } from '@/types';

export default function Vault() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;
    const vaultInfo = useVaultInfo(fAssetSymbol, agentVaultAddress, fAssetSymbol != null && agentVaultAddress != null);
    const updateVault = useUpdateVault();
    const formRef = useRef();

    const confirmModal = () => {
        const form = formRef.current.form();
        const status = form.validate();
        if (status.hasErrors) return;

        modals.openConfirmModal({
            title: t('edit_agent_vault.confirm_modal.title'),
            children: (
                <Text size="sm" className="whitespace-pre-line">
                    {t('edit_agent_vault.confirm_modal.content')}
                </Text>
            ),
            labels: {
                confirm: t('edit_agent_vault.confirm_modal.confirm_button'),
                cancel: t('edit_agent_vault.confirm_modal.cancel_button')
            },
            confirmProps: { color: 'red' },
            onConfirm: () => onSubmit(),
        });
    }
    const onSubmit = async() => {
        try {
            const form = formRef.current.form();
            const data = form.getValues();

            const payload: AgentSettingsDTO[] = [
                {
                    name: 'feeBIPS',
                    value: data.fee * 100
                },
                {
                    name: 'poolFeeShareBIPS',
                    value: data.poolFeeShare * 100
                },
                {
                    name: 'mintingVaultCollateralRatioBIPS',
                    value: data.mintingVaultCollateralRatio * 10000
                },
                {
                    name: 'mintingPoolCollateralRatioBIPS',
                    value: data.mintingPoolCollateralRatio * 10000
                },
                {
                    name: 'buyFAssetByAgentFactorBIPS',
                    value: data.buyFAssetByAgentFactor * 10000
                },
                {
                    name: 'poolExitCollateralRatioBIPS',
                    value: data.poolExitCollateralRatio * 10000
                },
                {
                    name: 'poolTopupCollateralRatioBIPS',
                    value: data.poolTopUpCollateralRatio * 10000
                },
                {
                    name: 'poolTopupTokenPriceFactorBIPS',
                    value: data.poolTopUpTokenPriceFactor * 10000
                }
            ];

            await updateVault.mutateAsync({
                fAssetSymbol: fAssetSymbol,
                agentVaultAddress: agentVaultAddress,
                payload: payload
            });
            showSucessNotification(t('edit_agent_vault.success_message'));
        } catch (error) {
            showErrorNotification((error as any).message);
        }
    }

    return (
        <Container
            size="xl"
        >
            <Button
                component={Link}
                href="/"
                variant="transparent"
                leftSection={<IconArrowLeft size={18} />}
                className="p-0 mb-3"
            >
                {t('edit_agent_vault.back_button')}
            </Button>
            <div >
                <div className="flex w-full">
                    <div className={`flex justify-between w-full md:w-9/12 mr-0 md:mr-10 shrink-0 ${!isEditing ? 'md:shrink' : ''}`}>
                        <Title order={2}>{t('edit_agent_vault.title')}</Title>
                        {!isEditing &&
                            <div className="ml-3">
                                <Button
                                    component={Link}
                                    href={`/vault/${fAssetSymbol}/${agentVaultAddress}/details`}
                                    variant="outline"
                                    className="mr-3"
                                    size="xs"
                                >
                                    {t('edit_agent_vault.details_button')}
                                </Button>
                                <Button
                                    size="xs"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {t('edit_agent_vault.edit_button')}
                                </Button>
                            </div>
                        }
                    </div>
                    <div className="mt-5 md:mt-0 w-full md:w-1/4" />
                </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap mt-5">
                <Paper
                    className="p-4 w-full md:w-9/12 mr-0 md:mr-10 relative"
                    withBorder
                >
                    <LoadingOverlay visible={vaultInfo.isPending} />
                    <VaultForm
                        ref={formRef}
                        vault={vaultInfo.data}
                        disabled={!isEditing}
                    />
                    {isEditing &&
                        <div className="flex justify-end mt-5">
                            <Button
                                variant="outline"
                                loading={updateVault.isPending}
                                onClick={() => setIsEditing(false)}
                                className="mr-4"
                            >
                                {t('edit_agent_vault.discard_button')}
                            </Button>
                            <Button
                                loading={updateVault.isPending}
                                onClick={confirmModal}
                            >
                                {t('edit_agent_vault.save_button')}
                            </Button>
                        </div>
                    }
                </Paper>
                {!isEditing &&
                    <AgentVaultOperationsCard
                        agentVault={vaultInfo.data}
                        className="mt-8 md:mt-0 border-primary w-full md:w-1/4 self-start"
                    />
                }
            </div>
        </Container>
    )
}

Vault.protected = true;
