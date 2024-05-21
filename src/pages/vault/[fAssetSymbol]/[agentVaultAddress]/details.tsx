import {
    Container,
    Textarea,
    Paper,
    Button,
    Title,
    LoadingOverlay
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import { useVaultInfo } from '@/api/agent';
import { useEffect, useState } from 'react';
export default function VaultDetails() {
    const [details, setDetails] = useState<string>('');
    const { t } = useTranslation();
    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;
    const vaultInfo = useVaultInfo(fAssetSymbol, agentVaultAddress, fAssetSymbol != null && agentVaultAddress != null);

    useEffect(() => {
        if (!vaultInfo.isFetched) return;

        let text = '';
        for (const [key, value] of Object.entries(vaultInfo.data)) {
            text += `${key}: ${value}\n`;
        }
        setDetails(text);
    }, [vaultInfo.isFetched]);

    const copyToClipboard = (text: string) => {
        console.log(text)
        navigator.clipboard.writeText(text)
    }

    return (
        <Container
            size="sm"
        >
            <LoadingOverlay visible={vaultInfo.isPending} />
            <Button
                component={Link}
                href={`/vault/${fAssetSymbol}/${agentVaultAddress}`}
                variant="transparent"
                leftSection={<IconArrowLeft size={18} />}
                className="p-0 mb-3"
            >
                {t('agent_vault_details.back_button')}
            </Button>
            <div className="flex justify-between items-center">
                <Title order={2} className="mr-3">{t('agent_vault_details.title')}</Title>
                <Button
                    size="xs"
                    onClick={() => copyToClipboard(details)}
                >
                    {t('agent_vault_details.copy_button')}
                </Button>
            </div>
            <Paper
                className="mt-5 p-4"
                withBorder
            >
                <Textarea
                    value={details}
                    minRows={3}
                    autosize={true}
                />
            </Paper>
        </Container>
    );
}
