import {
    Paper,
    Text,
    Badge,
    Anchor,
    rem
} from '@mantine/core';
import { useIsWhitelisted } from "@/api/agent";
import { useTranslation, Trans } from "react-i18next";
import { IconArrowUpRight } from "@tabler/icons-react";
import { truncateString } from "@/utils";
import { useWeb3 } from "@/hooks/useWeb3";

interface IManagementAddressCard {
    className?: string;
}

export default function ManagementAddressCard({ className }: IManagementAddressCard) {
    const { t } = useTranslation();
    const isWhitelisted = useIsWhitelisted();
    const { account } = useWeb3();

    return (
        <Paper
            className={`p-7 ${className}`}
            withBorder
        >
            <div className="flex justify-between flex-wrap md:flex-nowrap">
                <div className="flex justify-between sm:justify-normal w-full sm:w-auto">
                    <Text
                        className="mr-3"
                        c="var(--mantine-color-gray-7)"
                        size="sm"
                    >
                        {t('management_address_card.management_address_label')}
                    </Text>
                    <Text
                        size="sm"
                        className="hidden sm:block"
                    >
                        {account}
                    </Text>
                    <Text
                        size="sm"
                        className="sm:hidden"
                    >
                        {truncateString(account ?? '', 9, 9)}
                    </Text>
                </div>
                {!isWhitelisted.isPending &&
                    <Badge
                        variant="filled"
                        color={isWhitelisted.data ? 'rgba(36, 36, 37, 0.06)' : 'var(--mantine-color-red-1)'}
                        radius="xs"
                        className={`uppercase font-normal flex-shrink-0 ml-0 mt-2 md:mt-0 md:ml-3 ${isWhitelisted.data ? 'text-black' : 'text-red-700'}`}
                    >
                        {t(`management_address_card.${isWhitelisted.data ? 'address_whitelisted_label' : 'address_not_whitelisted_label'}`)}
                    </Badge>
                }
            </div>
            {isWhitelisted.data === false &&
                <Paper
                    className="px-7 py-4 mt-6 max-w-full sm:max-w-xl"
                    radius="lg"
                    styles={{
                        root: {
                            backgroundColor: 'rgba(223, 233, 253, 1)'
                        }
                    }}
                >
                    <Trans
                        i18nKey="management_address_card.how_to_whitelist_agent_description"
                        parent={Text}
                        size="sm"
                        components={{
                            a: <Anchor
                                underline="always"
                                href="https://t.me/FlareFAssetsBot"
                                target="_blank"
                                className="inline-flex ml-1"
                                c="black"
                            />,
                            icon: <IconArrowUpRight
                                style={{ width: rem(20), height: rem(20) }}
                                className="ml-1"
                            />
                        }}
                    />
                </Paper>
            }
        </Paper>
    );
}
