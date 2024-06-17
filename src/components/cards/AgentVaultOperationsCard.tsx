import {
    Title,
    Paper,
    Button,
    LoadingOverlay
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DepositCollateralModal from '@/components/modals/DepositCollateralModal';
import DepositFLRModal from '@/components/modals/DepositFLRModal';
import ActivateVaultModal from '@/components/modals/ActivateVaultModal';
import DeactivateVaultModal from '@/components/modals/DeactivateVaultModal';
import { IAgentVault } from '@/types';


interface IAgentVaultOperationsCard {
    className?: string;
    agentVault: IAgentVault|undefined;
}

export default function AgentVaultOperationsCard({ className, agentVault }: IAgentVaultOperationsCard) {
    const { t } = useTranslation();
    const [isDepositCollateralModalActive, setIsDepositCollateralModalActive] = useState<boolean>(false);
    const [isDepositFLRModalActive, setIsDepositFLRModalActive] = useState<boolean>(false);
    const [isActivateVaultModalActive, setIsActivateVaultModalActive] = useState<boolean>(false);
    const [isDeactivateVaultModalActive, setIsDeactivateVaultModalActive] = useState<boolean>(false);

    return (
        <Paper
            className={`relative p-4 ${className}`}
            withBorder
        >
            <LoadingOverlay visible={agentVault == null} />
            <Title order={5} className="mb-8">{t('agent_vault_operations_card.title')}</Title>
            <Button
                variant="gradient"
                onClick={() => setIsDepositCollateralModalActive(true)}
                className="block mb-3"
            >
                {t('agent_vault_operations_card.deposit_collateral_button')}
            </Button>
            <Button
                variant="gradient"
                onClick={() => setIsDepositFLRModalActive(true)}
                className="block mb-3"
            >
                {t('agent_vault_operations_card.deposit_flr_in_pool_button')}
            </Button>
            <Button
                variant="gradient"
                onClick={() => setIsActivateVaultModalActive(true)}
                className="block mb-3"
                disabled={agentVault?.publiclyAvailable}
            >
                {t('agent_vault_operations_card.activate_vault_button')}
            </Button>
            <Button
                variant="gradient"
                onClick={() => setIsDeactivateVaultModalActive(true)}
            >
                {t('agent_vault_operations_card.close_vault_button')}
            </Button>
            {agentVault &&
                <>
                    <DepositCollateralModal
                        agentVault={agentVault}
                        opened={isDepositCollateralModalActive}
                        onClose={() => setIsDepositCollateralModalActive(false)}
                    />
                    <DepositFLRModal
                        opened={isDepositFLRModalActive}
                        onClose={() => setIsDepositFLRModalActive(false)}
                    />
                </>
            }
            <ActivateVaultModal
                opened={isActivateVaultModalActive}
                onClose={() => setIsActivateVaultModalActive(false)}
            />
            <DeactivateVaultModal
                opened={isDeactivateVaultModalActive}
                onClose={() => setIsDeactivateVaultModalActive(false)}
            />
        </Paper>
    );
}
