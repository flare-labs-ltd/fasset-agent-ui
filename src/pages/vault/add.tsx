import {
    Container,
    Title,
    Paper,
    Button,
    Text,
    Divider,
    Anchor,
    Group
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation'
import { modals } from '@mantine/modals';
import { useState, useRef } from 'react';
import VaultForm, { FormRef } from '@/components/forms/VaultForm';
import { useBalances, useCreateVault } from '@/api/agent';
import { showErrorNotification } from '@/hooks/useNotifications';
import { IAgentSettingsConfig } from '@/types';
import BackButton from "@/components/elements/BackButton";
import { toNumber } from "@/utils";
import { MIN_CREATE_VAULT_BALANCE } from "@/constants";

export default function AddVault() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    const formRef = useRef<FormRef>(null);
    const createVault = useCreateVault();
    const balances = useBalances(false);

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
                    <Group justify="space-between" className="mt-5">
                        <Anchor
                            href="https://docs.flare.network/infra/fassets/agent/"
                            target="_blank"
                            size="sm"
                            c="gray"
                        >
                            {t('add_agent_vault.confirm_modal.need_help_label')}
                        </Anchor>
                        <Button
                            onClick={onSubmit}
                            radius="xl"
                            size="md"
                        >
                            {t('add_agent_vault.confirm_modal.confirm_button')}
                        </Button>
                    </Group>
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
                poolTopupTokenPriceFactor: data.poolTopUpTokenPriceFactor,
                handshakeType: Number(data.handshakeType)
            }

            createVault.mutateAsync({
                fAssetSymbol: data.fAssetType,
                payload: payload
            }).catch(error => {
                showErrorNotification((error as any).response.data.message);
            });

            await router.push('/');
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
