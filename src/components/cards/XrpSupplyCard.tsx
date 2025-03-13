import {
    LoadingOverlay,
    Paper,
    SimpleGrid,
    Text
} from "@mantine/core";
import { useRedemptionQueueData } from "@/api/agent";
import { useTranslation } from "react-i18next";

interface IXrpSupplyCard {
    className?: string
}

export default function XrpSupplyCard({ className }: IXrpSupplyCard) {
    const redemptionQueueData = useRedemptionQueueData();
    const { t } = useTranslation();

    return (
        <Paper
            className={`relative p-4 ${className ?? ''}`}
            withBorder
        >
            <LoadingOverlay visible={redemptionQueueData.isPending} />
            <SimpleGrid cols={2}>
                <div>
                    <Text
                        c="var(--flr-darkest-gray)"
                        fw={400}
                        size="sm"
                    >
                        {t('xrp_supply_card.current_redemption_queue_label')}
                    </Text>
                    <Text
                        c="var(--flr-black)"
                        fw={400}
                        size="md"
                    >
                        {redemptionQueueData.data?.redemptionQueueLots ?? 0}
                        <span className="ml-1 text-[var(--flr-darkest-gray)]">{t('xrp_supply_card.lots_label')}</span>
                    </Text>
                </div>
                <div>
                    <Text
                        c="var(--flr-darkest-gray)"
                        fw={400}
                        size="sm"
                    >
                        {t('xrp_supply_card.total_minted_label')}
                    </Text>
                    <Text
                        c="var(--flr-black)"
                        fw={400}
                        size="md"
                    >
                        {redemptionQueueData.data?.redemptionQueueLots ?? 0}
                        <span className="ml-1 text-[var(--flr-darkest-gray)]">{t('xrp_supply_card.lots_label')}</span>
                    </Text>
                </div>
            </SimpleGrid>
        </Paper>
    );
}
