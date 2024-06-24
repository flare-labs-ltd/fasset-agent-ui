import {
    Container,
    Title,
    Paper,
    Button,
    Text,
    Divider
} from '@mantine/core';
import { useTranslation, Trans } from 'react-i18next';
import { useRouter } from 'next/navigation'
import { modals } from '@mantine/modals';
import { useState, useRef } from 'react';
import VaultForm, { FormRef } from '@/components/forms/VaultForm';
import { useCreateVault, useGetUnderlyingAssetBalance } from '@/api/agent';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import { IAgentSettingsConfig } from '@/types';
import BackButton from "@/components/elements/BackButton";

const MIN_XRP_LIMIT = 50;

export default function AddVault() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fAssetSymbol, setFAssetType] = useState<string|null>(null);
    const { t } = useTranslation();
    const router = useRouter();
    const formRef = useRef<FormRef>(null);
    const createVault = useCreateVault();
    const underlyingAssetBalance = useGetUnderlyingAssetBalance(fAssetSymbol, false);

    const confirmModal = () => {
        const form = formRef?.current?.form();
        const status = form?.validate();
        if (status?.hasErrors || !form) return;

        modals.open({
            title: t('add_agent_vault.confirm_modal.title'),
            children: (
                <>
                    <Text size="sm" className="whitespace-pre-line">
                        {t('add_agent_vault.confirm_modal.content')}
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

            ),
            centered: true,
        });
    }

    const onSubmit = async() => {
        try {
            modals.closeAll();
            setIsLoading(true);
            const form = formRef?.current?.form();
            const data = form?.getValues();
            
            await setFAssetType(data.fAssetType);
            await underlyingAssetBalance.refetch();
            if (underlyingAssetBalance.data < MIN_XRP_LIMIT) {
                showErrorNotification(t('add_agent_vault.xrp_min_limit_error'));
                return;
            }

            const payload: IAgentSettingsConfig = {
                poolTokenSuffix: data.poolTokenSuffix.toUpperCase(),
                vaultCollateralFtsoSymbol: data.vaultCollateralToken,
                fee: `${data.fee}%`,
                poolFeeShare: `${data.poolFeeShare}%`,
                mintingVaultCollateralRatio: data.mintingVaultCollateralRatio,
                mintingPoolCollateralRatio: data.mintingPoolCollateralRatio,
                poolExitCollateralRatio: data.poolExitCollateralRatio,
                buyFAssetByAgentFactor: data.buyFAssetByAgentFactor,
                poolTopupCollateralRatio: data.poolTopUpCollateralRatio,
                poolTopupTokenPriceFactor: data.poolTopUpTokenPriceFactor
            }

            await createVault.mutateAsync({
                fAssetSymbol: data.fAssetType,
                payload: payload
            });

            showSucessNotification(t('add_agent_vault.success_message'));
            router.push('/');
        } catch (error) {
            showErrorNotification((error as any).response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    const onDiscard = () => {
        const form = formRef?.current?.form();
        if (form) {
            form.reset();
        }
        router.push('/');
    }

    return (
        <Container
            size="sm"
        >
            <BackButton
                href="/"
                text={t('add_agent_vault.back_button')}
            />
            <Title order={2} fw={300}>{t('add_agent_vault.title')}</Title>
            <Paper
                className="mt-5 p-8"
            >
                <VaultForm ref={formRef} />
                <Trans
                    i18nKey="add_agent_vault.min_amount_description_label"
                    parent={Text}
                    size="xs"
                    className="whitespace-pre-line mt-4"
                    components={[
                        <Text
                            size="xs"
                            component="a"
                            target="_blank"
                            href="https://test.bithomp.com/faucet"
                            c="primary"
                            key="https://test.bithomp.com/faucet"
                        />,
                        <Text
                            size="xs"
                            component="a"
                            target="_blank"
                            href="https://faucet.flare.network"
                            c="primary"
                            key="https://faucet.flare.network"
                        />
                    ]}
                />
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
                        loading={isLoading}
                        onClick={onDiscard}
                        fullWidth
                        className="mr-0 sm:mr-3 mb-3 sm:mb-0"
                        radius="xl"
                        size="md"
                    >
                        {t('add_agent_vault.discard_button')}
                    </Button>
                    <Button
                        loading={isLoading}
                        onClick={confirmModal}
                        fullWidth
                        radius="xl"
                        size="md"
                    >
                        {t('add_agent_vault.save_button')}
                    </Button>
                </div>
            </Paper>
        </Container>
    );
}

AddVault.protected = true;
