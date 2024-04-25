import {
    Container,
    Title,
    Paper,
    Button,
    Text
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useVaultInfo } from '@/api/agent';
import VaultForm from '@/components/forms/VaultForm';
import { showErrorNotification, showSucessNotification } from '@/hooks/useNotifications';
import AgentVaultOperationsCard from '@/components/cards/AgentVaultOperationsCard';

export default function Vault() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const router = useRouter();
    const { symbol, vaultId } = router.query;
    const vaultInfo = useVaultInfo(symbol, vaultId, symbol != null && vaultId != null);
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
            setIsLoading(true);
        } catch (error) {
            showErrorNotification((error as any).message);
        } finally {
            setIsLoading(false);
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
                    <div className="flex justify-between w-full md:w-9/12 mr-0 md:mr-10 shrink-0 md:shrink">
                        <Title order={2}>{t('edit_agent_vault.title')}</Title>
                        <div className="ml-3">
                            <Button
                                component={Link}
                                href={`/vault/${symbol}/${vaultId}/details`}
                                variant="outline"
                                className="mr-3"
                                size="xs"
                            >
                                {t('edit_agent_vault.details_button')}
                            </Button>
                            {!isEditing &&
                                <Button
                                    size="xs"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {t('edit_agent_vault.edit_button')}
                                </Button>
                            }
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 w-full md:w-4/12" />
                </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap mt-5">
                <Paper
                    className="p-4 w-full md:w-9/12 mr-0 md:mr-10"
                    withBorder
                >
                    <VaultForm
                        ref={formRef}
                        vault={vaultInfo.data}
                        loading={vaultInfo.isPending}
                        disabled={!isEditing}
                    />
                    {isEditing &&
                        <div className="flex justify-end mt-5">
                            <Button
                                variant="outline"
                                loading={isLoading}
                                onClick={() => setIsEditing(false)}
                                className="mr-4"
                            >
                                {t('edit_agent_vault.discard_button')}
                            </Button>
                            <Button
                                loading={isLoading}
                                onClick={confirmModal}
                            >
                                {t('edit_agent_vault.save_button')}
                            </Button>
                        </div>
                    }
                </Paper>
                {!isEditing &&
                    <AgentVaultOperationsCard
                        className="mt-8 md:mt-0 border-primary w-full md:w-4/12 self-start"
                    />
                }
            </div>
        </Container>
    )
}

Vault.protected = true;
