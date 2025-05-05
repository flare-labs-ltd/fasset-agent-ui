import {
    Paper,
    Text,
    Badge,
    Anchor,
    rem
} from "@mantine/core";
import { useIsWhitelisted, useManagementAddress, useUnderlyingAddresses } from "@/api/agent";
import { useTranslation, Trans } from "react-i18next";
import { IconArrowUpRight } from "@tabler/icons-react";
import { truncateString } from "@/utils";
import CopyIcon from '@/components/icons/CopyIcon';

interface IManagementAddressCard {
    className?: string;
}

export default function ManagementAddressCard({ className }: IManagementAddressCard) {
    const { t } = useTranslation();
    const isWhitelisted = useIsWhitelisted();
    const managementAddress= useManagementAddress();
    const underlyingAddresses = useUnderlyingAddresses();

    return (
        <Paper
            className={`p-7 ${className}`}
            withBorder
        >
            <div className="flex justify-between flex-wrap md:flex-nowrap">
                <div className="flex justify-between sm:justify-normal w-full sm:w-auto flex-wrap items-center">
                    <Text
                        className="mr-3"
                        c="var(--flr-darkest-gray)"
                        size="sm"
                    >
                        {t('management_address_card.management_address_label')}
                    </Text>
                    <Text
                        size="sm"
                        className="hidden sm:block"
                    >
                        {managementAddress.data}
                    </Text>
                    <Text
                        size="sm"
                        className="sm:hidden"
                    >
                        {truncateString(managementAddress.data ?? '', 9, 9)}
                    </Text>
                    <CopyIcon
                        text={managementAddress.data ?? ''}
                    />
                </div>
                {!isWhitelisted.isPending &&
                    <Badge
                        variant="filled"
                        color={isWhitelisted.data ? 'var(--flr-lightest-gray)' : 'var(--mantine-color-red-1)'}
                        radius="xs"
                        className={`uppercase font-normal flex-shrink-0 ml-0 mt-2 md:mt-0 md:ml-3 ${isWhitelisted.data ? 'text-[var(--flr-black)] dark:text-[var(--flr-white)]' : 'text-red-700'}`}
                    >
                        {t(`management_address_card.${isWhitelisted.data ? 'address_whitelisted_label' : 'address_not_whitelisted_label'}`)}
                    </Badge>
                }
            </div>
            <div className="flex justify-between flex-wrap md:flex-nowrap mt-2">
                <div className="flex justify-between sm:justify-normal w-full sm:w-auto flex-wrap">
                    <Text
                        className="mr-3"
                        c="var(--flr-darkest-gray)"
                        size="sm"
                    >
                        {t('management_address_card.underlying_addresses_label')}
                    </Text>
                    <div>
                        {underlyingAddresses?.data?.map(address => (
                            <div className="flex items-center" key={address.asset}>
                                <Text
                                    size="sm"
                                    className="hidden sm:block"
                                >
                                    {address.asset}: {address.address}
                                </Text>
                                <Text
                                    size="sm"
                                    className="sm:hidden"
                                >
                                    {address.asset}: {truncateString(address.address, 9, 9)}
                                </Text>
                                <CopyIcon
                                    text={address.address}
                                />
                            </div>
                        ))}
                    </div>
                </div>
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
                                style={{width: rem(20), height: rem(20)}}
                                className="ml-1"
                            />
                        }}
                    />
                </Paper>
            }
        </Paper>
    );
}
