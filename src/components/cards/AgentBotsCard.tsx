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
import { ICollateralItem } from "@/types";
import { UseQueryResult } from "@tanstack/react-query";

interface IAgentBotsCard {
    className?: string;
    collateral: UseQueryResult<ICollateralItem[], Error>;
}

export default function AgentBotsCard({ className,  collateral}: IAgentBotsCard) {
    const [usdcLabel, setUsdcLabel] = useState<string>();
    const [usdtLabel, setUsdtLabel] = useState<string>();
    const [flrLabel, setFlrLabel] = useState<string>();
    const [ethLabel, setEthLabel] = useState<string>();

    const { t } = useTranslation();
    const workAddress = useWorkAddress();
    const botStatus = useBotStatus();

    useEffect(() => {
        if (collateral.data === undefined) return;
        setUsdcLabel(collateral.data.find(collateral => collateral.symbol.toLowerCase() === 'testusdc')?.balance);
        setUsdtLabel(collateral.data.find(collateral => collateral.symbol.toLowerCase() === 'testusdt')?.balance);
        setFlrLabel(collateral.data.find(collateral => collateral.symbol.toLowerCase() === 'cflr')?.balance);
        setEthLabel(collateral.data.find(collateral => collateral.symbol.toLowerCase() === 'testeth')?.balance);
    }, [collateral]);

    let textColorStatus = 'var(--dark-red-default)';
    if (botStatus.data) {
        textColorStatus = 'var(--green-default)';
    }

    return (
        <Paper
            className={`${className}`}
            withBorder
        >
            <Table.ScrollContainer minWidth={470}>
                <Table
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
                                className={`uppercase ${classes.sticky}`}
                            >
                                {t('agent_bots_card.table.actions_label')}
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {collateral.isPending &&
                            <Table.Tr>
                                <Table.Td
                                    colSpan={8}
                                >
                                    <Loader className="flex mx-auto mt-2" />
                                </Table.Td>
                            </Table.Tr>
                        }
                        {collateral.data !== undefined &&
                            <Table.Tr>
                                <Table.Td>1</Table.Td>
                                <Table.Td>
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <Badge
                                            variant="outline"
                                            color={textColorStatus}
                                            radius="xs"
                                            className={`font-normal`}
                                        >
                                        <div className="flex items-center">
                                            <span className="status-dot mr-2" style={{ backgroundColor: textColorStatus }}></span>
                                            <span style={{ color: textColorStatus }}>
                                                {t(`agent_bots_card.table.agent_${botStatus.data  ? 'live' : 'offline'}_label`)}
                                            </span>
                                        </div>
                                    </Badge>
                                    </div>
                                </div>
                                
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
                                                component={Link}
                                                leftSection={<IconPencilPlus style={{ width: rem(14), height: rem(14) }} />}
                                                href="/vault/add"
                                            >
                                                {t('agent_bots_card.table.actions_menu.add_vault_label')}
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
