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
    useWorkAddress
} from "@/api/agent";
import {
    IconDots,
    IconPencilPlus
} from "@tabler/icons-react";
import { truncateString } from "@/utils";
import { useState, useEffect } from "react";
import CopyIcon from "@/components/icons/CopyIcon";
import classes from "@/styles/components/cards/AgentBotsCard.module.scss";
import { IBalance } from "@/types";
import { UseQueryResult } from "@tanstack/react-query";

interface IAgentBotsCard {
    className?: string;
    balances: UseQueryResult<IBalance[], Error>;
}

export default function AgentBotsCard({ className,  balances}: IAgentBotsCard) {
    const { t } = useTranslation();
    const workAddress = useWorkAddress();
    const botStatus = useBotStatus();

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
                            {balances?.data?.map(balance => (
                                <Table.Th key={balance.symbol}>
                                    {balance.symbol}
                                </Table.Th>
                            ))}
                            <Table.Th
                                className={`uppercase ${classes.sticky}`}
                            >
                                {t('agent_bots_card.table.actions_label')}
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {balances.isPending &&
                            <Table.Tr>
                                <Table.Td
                                    colSpan={8}
                                >
                                    <Loader className="flex mx-auto mt-2" />
                                </Table.Td>
                            </Table.Tr>
                        }
                        {balances.data !== undefined &&
                            <Table.Tr>
                                <Table.Td>1</Table.Td>
                                <Table.Td>
                                    <div className="flex items-center mb-1">
                                        <Badge
                                            variant="outline"
                                            color={textColorStatus}
                                            radius="xs"
                                            className={`font-normal`}
                                        >
                                            <div className="flex items-center">
                                                <span className="status-dot mr-2"
                                                      style={{backgroundColor: textColorStatus}}></span>
                                                <span style={{color: textColorStatus}}>
                                                        {t(`agent_bots_card.table.agent_${botStatus.data ? 'live' : 'offline'}_label`)}
                                                    </span>
                                            </div>
                                        </Badge>
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
                                {balances?.data.map(balance => (
                                    <Table.Td key={balance.symbol}>
                                        {balance.balance}
                                    </Table.Td>
                                ))}
                                <Table.Td className={classes.sticky}>
                                    <Menu>
                                        <Menu.Target>
                                            <IconDots
                                                style={{width: rem(20), height: rem(20)}}
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
