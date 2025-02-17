import {
    Container,
    Textarea,
    Paper,
    Button,
    Title,
    LoadingOverlay,
    Popover, Text
} from "@mantine/core";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useVaultInfo } from '@/api/agent';
import { useEffect, useState } from "react";
import BackButton from "@/components/elements/BackButton";
import { copyToClipboard } from "@/utils";

export default function VaultDetails() {
    const [isPopoverActive, setIsPopoverActive] = useState<boolean>(false);
    const [details, setDetails] = useState<string>('');
    const { t } = useTranslation();
    const router = useRouter();
    const { fAssetSymbol, agentVaultAddress } = router.query;
    const vaultInfo = useVaultInfo(fAssetSymbol as string, agentVaultAddress as string, fAssetSymbol != null && agentVaultAddress != null);

    useEffect(() => {
        if (!vaultInfo.isFetched) return;

        let text = '';
        //@ts-ignore
        for (const [key, value] of Object.entries(vaultInfo.data)) {
            text += `${key}: ${value}\n`;
        }
        setDetails(text);
    }, [vaultInfo.isFetched]);

    const onCopyClick = (text: string) => {
        setIsPopoverActive(true);
        setTimeout(() => {
            setIsPopoverActive(false);
        }, 800);
        copyToClipboard(text);
    }

    return (
        <Container
            size="sm"
        >
            <LoadingOverlay visible={vaultInfo.isPending} />
            <BackButton
                href={`/vault/${fAssetSymbol}/${agentVaultAddress}`}
                text={t('agent_vault_details.back_button')}
            />
            <div className="flex justify-between items-center">
                <Title order={2} className="mr-3">{t('agent_vault_details.title')}</Title>
                <Popover
                    withArrow
                    opened={isPopoverActive}
                    onChange={() => setIsPopoverActive(false)}
                >
                    <Popover.Target>
                        <Button
                            size="xs"
                            variant="gradient"
                            onClick={() => onCopyClick(details)}
                        >
                            {t('agent_vault_details.copy_button')}
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown className="p-2 bg-black text-white">
                        <Text size="xs">{t('copy_icon.copied_label')}</Text>
                    </Popover.Dropdown>
                </Popover>
            </div>
            <Paper
                className="mt-5 p-4"
                withBorder
            >
                <div className="p-4 border border-[var(--flr-border)] rounded-md">
                    {vaultInfo.data && Object.entries(vaultInfo.data)
                        .filter(([key, value]) => typeof value !== "object")
                        .map(([key, value]) => (
                            <div
                                key={key}
                                className="flex mb-1"
                            >
                                <Text
                                    fw={600}
                                    className="mr-1"
                                >
                                    {key}:
                                </Text>
                                <Text>{value}</Text>
                            </div>
                    ))}
                </div>
            </Paper>
        </Container>
    );
}
