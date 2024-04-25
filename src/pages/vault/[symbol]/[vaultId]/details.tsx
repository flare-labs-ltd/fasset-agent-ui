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
    const { symbol, vaultId } = router.query;
    const vaultInfo = useVaultInfo(symbol, vaultId, symbol != null && vaultId != null);

    useEffect(() => {
        if (!vaultInfo.isFetched) return;

        let text = '';
        for (const [key, value] of Object.entries(vaultInfo.data)) {
            text += `${key}: ${value}\n`;
        }
        setDetails(text);
    }, [vaultInfo.isFetched]);

    return (
        <Container
            size="sm"
        >
            <LoadingOverlay visible={vaultInfo.isPending} />
            <Button
                component={Link}
                href={`/vault/${symbol}/${vaultId}`}
                variant="transparent"
                leftSection={<IconArrowLeft size={18} />}
                className="p-0 mb-3"
            >
                {t('agent_vault_details.back_button')}
            </Button>
            <Title order={2}>{t('agent_vault_details.title')}</Title>
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
