import {
    Container,
    Title,
    Paper,
    Button,
    Text,
    LoadingOverlay,
    Divider
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { modals } from '@mantine/modals';
import { useVaultInfo, useUpdateVault } from '@/api/agent';
import VaultForm, { FormRef } from '@/components/forms/VaultForm';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import AgentVaultOperationsCard from '@/components/cards/AgentVaultOperationsCard';
import { IAgentSettingsDTO } from '@/types';
import BackButton from "@/components/elements/BackButton";

export default function Vault() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    let { fAssetSymbol, agentVaultAddress } = router.query;
    fAssetSymbol = fAssetSymbol as string;
    agentVaultAddress = agentVaultAddress as string;
    const vaultInfo = useVaultInfo(fAssetSymbol, agentVaultAddress, fAssetSymbol != null && agentVaultAddress != null);
    const updateVault = useUpdateVault();
    const formRef = useRef<FormRef>(null);

    const confirmModal = () => {
        const form = formRef?.current?.form();
        const status = form?.validate();
        if (status?.hasErrors || !form) return;

        modals.open({
            title: t('edit_agent_vault.confirm_modal.title'),
            children: (
                <>
                    <Text size="sm" className="whitespace-pre-line">
                        {t('edit_agent_vault.confirm_modal.content')}
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
                    <div className="flex justify-end">
                        <Button
                            onClick={onSubmit}
                            radius="xl"
                            size="md"
                            color="rgba(189, 34, 34, 1)"
                        >
                            {t('add_agent_vault.confirm_modal.confirm_button')}
                        </Button>
                    </div>
                </>
            )
        });
    }
    const onSubmit = async() => {
        try {
            modals.closeAll();
            const form = formRef?.current?.form();
            const data = form?.getValues();

            const payload: IAgentSettingsDTO[] = [
                {
                    name: 'feeBIPS',
                    value: (data.fee * 100).toString()
                },
                {
                    name: 'poolFeeShareBIPS',
                    value: (data.poolFeeShare * 100).toString()
                },
                {
                    name: 'mintingVaultCollateralRatioBIPS',
                    value: (data.mintingVaultCollateralRatio * 10000).toString()
                },
                {
                    name: 'mintingPoolCollateralRatioBIPS',
                    value: (data.mintingPoolCollateralRatio * 10000).toString()
                },
                {
                    name: 'buyFAssetByAgentFactorBIPS',
                    value: (data.buyFAssetByAgentFactor * 10000).toString()
                },
                {
                    name: 'poolExitCollateralRatioBIPS',
                    value: (data.poolExitCollateralRatio * 10000).toString()
                },
                {
                    name: 'poolTopupCollateralRatioBIPS',
                    value: (data.poolTopUpCollateralRatio * 10000).toString()
                },
                {
                    name: 'poolTopupTokenPriceFactorBIPS',
                    value: (data.poolTopUpTokenPriceFactor * 10000).toString()
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
            <BackButton
                href="/"
                text={t('edit_agent_vault.back_button')}
            />
            <div >
                <div className="flex w-full">
                    <div className={`flex justify-between w-full md:w-9/12 mr-0 md:mr-10 shrink-0 ${!isEditing ? 'md:shrink' : ''}`}>
                        <Title order={2}>{t('edit_agent_vault.title')}</Title>
                        {!isEditing &&
                            <div className="ml-3">
                                <Button
                                    component={Link}
                                    href={`/vault/${fAssetSymbol}/${agentVaultAddress}/details`}
                                    variant="gradient"
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
                    className="p-8 w-full md:w-9/12 mr-0 md:mr-10 relative"
                    withBorder
                >
                    <LoadingOverlay visible={vaultInfo.isPending} />
                    <VaultForm
                        ref={formRef}
                        vault={vaultInfo.data}
                        disabled={!isEditing}
                    />
                    {isEditing &&
                        <>
                            <Divider
                                className="my-8"
                                styles={{
                                    root: {
                                        marginLeft: '-2rem',
                                        marginRight: '-2rem'
                                    }
                                }}
                            />
                            <div className="flex justify-between flex-wrap sm:flex-nowrap">
                                <Button
                                    variant="gradient"
                                    loading={updateVault.isPending}
                                    onClick={() => setIsEditing(false)}
                                    fullWidth
                                    className="mr-0 sm:mr-3 mb-3 sm:mb-0"
                                    radius="xl"
                                    size="md"
                                >
                                    {t('edit_agent_vault.discard_button')}
                                </Button>
                                <Button
                                    loading={updateVault.isPending}
                                    onClick={confirmModal}
                                    fullWidth
                                    radius="xl"
                                    size="md"
                                >
                                    {t('edit_agent_vault.save_button')}
                                </Button>
                            </div>
                        </>
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
