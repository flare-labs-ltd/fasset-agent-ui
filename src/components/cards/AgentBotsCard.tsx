import {
    Paper,
    Table,
    Loader,
    Badge,
    rem,
    Menu
} from "@mantine/core";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
    useBotStatus,
    useCollaterals,
    useWorkAddress
} from "@/api/agent";
import {
    IconDots,
    IconFileSearch,
    IconPencilPlus
} from "@tabler/icons-react";
import { truncateString } from "@/utils";
import { useState, useEffect } from "react";
import CopyIcon from "@/components/icons/CopyIcon";
import classes from "@/styles/components/cards/AgentBotsCard.module.scss";

interface IAgentBotsCard {
    className?: string;
}

export default function AgentBotsCard({ className }: IAgentBotsCard) {
    const [usdcLabel, setUsdcLabel] = useState<string>();
    const [usdtLabel, setUsdtLabel] = useState<string>();
    const [flrLabel, setFlrLabel] = useState<string>();
    const [ethLabel, setEthLabel] = useState<string>();

    const { t } = useTranslation();
    const collaterals = useCollaterals();
    const workAddress = useWorkAddress();
    const botStatus = useBotStatus();

    useEffect(() => {
        if (collaterals.data === undefined) return;
        setUsdcLabel(collaterals.data.find(collateral => collateral.symbol.toLowerCase() === 'testusdc')?.balance);
        setUsdtLabel(collaterals.data.find(collateral => collateral.symbol.toLowerCase() === 'testusdt')?.balance);
        setFlrLabel(collaterals.data.find(collateral => collateral.symbol.toLowerCase() === 'cflr')?.balance);
        setEthLabel(collaterals.data.find(collateral => collateral.symbol.toLowerCase() === 'testeth')?.balance);
    }, [collaterals.data]);

    return (
        <Paper
            className={`p-4 ${className}`}
            withBorder
        >
            <Table.ScrollContainer minWidth={470}>
                <Table
                    withTableBorder
                    verticalSpacing="md"
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="uppercase">#</Table.Th>
                            <Table.Th className="uppercase">{t('agent_bots_card.table.status_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('agent_bots_card.table.working_address_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('agent_bots_card.table.usdc_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('agent_bots_card.table.usdt_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('agent_bots_card.table.eth_label')}</Table.Th>
                            <Table.Th className="uppercase">{t('agent_bots_card.table.flr_label')}</Table.Th>
                            <Table.Th
                                className={`uppercase text-right ${classes.sticky}`}
                            >
                                {t('agent_bots_card.table.actions_label')}
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {collaterals.isPending &&
                            <Table.Tr>
                                <Table.Td
                                    colSpan={8}
                                >
                                    <Loader className="flex mx-auto mt-2" />
                                </Table.Td>
                            </Table.Tr>
                        }
                        {collaterals.data !== undefined &&
                            <Table.Tr>
                                <Table.Td>1</Table.Td>
                                <Table.Td>
                                    <Badge
                                        variant="filled"
                                        color={botStatus.data ? 'rgba(36, 36, 37, 0.06)' : 'var(--mantine-color-red-1)'}
                                        radius="xs"
                                        className={`uppercase font-normal ${botStatus.data ? 'text-black' : 'text-red-700'}`}
                                    >
                                        {t(`agent_bots_card.table.${botStatus.data ? 'agent_online_label' : 'agent_offline_label'}`)}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <div className="flex items-center">
                                        {truncateString(workAddress.data ?? '', 5, 5)}
                                        <CopyIcon
                                            text={workAddress.data ?? ''}
                                        />
                                    </div>
                                </Table.Td>
                                <Table.Td>{usdcLabel}</Table.Td>
                                <Table.Td>{usdtLabel}</Table.Td>
                                <Table.Td>{ethLabel}</Table.Td>
                                <Table.Td>{flrLabel}</Table.Td>
                                <Table.Td className={classes.sticky}>
                                    <Menu>
                                        <Menu.Target>
                                            <IconDots
                                                style={{ width: rem(20), height: rem(20) }}
                                                className="cursor-pointer ml-auto"
                                            />
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>{t('agent_bots_card.table.actions_menu.title')}</Menu.Label>
                                            <Menu.Item
                                                leftSection={<IconFileSearch style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                <Link
                                                    href="/configure"
                                                >
                                                    {t('agent_bots_card.table.actions_menu.settings_label')}
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconPencilPlus style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                <Link
                                                    href="/vault/add"
                                                >
                                                    {t('agent_bots_card.table.actions_menu.add_vault_label')}
                                                </Link>
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Table.Td>
                            </Table.Tr>
                        }
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Paper>
    );
}
