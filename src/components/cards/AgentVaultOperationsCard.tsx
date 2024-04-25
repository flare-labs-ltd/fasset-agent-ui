import {
    Title,
    Text,
    Paper,
    Button,
    TextInput
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import DepositCollateralModal from '@/components/modals/DepositCollateralModal';
import { useState } from 'react';

interface IAgentVaultOperationsCard {
    className?: string
}

export default function AgentVaultOperationsCard({ className }: IAgentVaultOperationsCard) {
    const { t } = useTranslation();
    const [isDepositCollateralModalActive, setIsDepositCollateralModalActive] = useState<boolean>(false);

    return (
        <Paper
            className={`p-4 ${className}`}
            withBorder
        >
            <Title order={6} className="mb-8">{t('agent_vault_operations_card.title')}</Title>
            <Button
                onClick={() => setIsDepositCollateralModalActive(true)}
                className="block mb-3"
            >
                {t('agent_vault_operations_card.deposit_collateral_button')}
            </Button>
            <Button
                className="block mb-3"
            >
                {t('agent_vault_operations_card.deposit_flr_in_pool_button')}
            </Button>
            <Button
                className="block mb-3"
            >
                {t('agent_vault_operations_card.activate_vault_button')}
            </Button>
            <Button>
                {t('agent_vault_operations_card.close_vault_button')}
            </Button>
            <DepositCollateralModal
                opened={isDepositCollateralModalActive}
                onClose={() => setIsDepositCollateralModalActive(false)}
            />
        </Paper>
    );
}
