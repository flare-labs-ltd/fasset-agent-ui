import {
    Button,
    Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/hooks/useWeb3';
import { useConnectWalletModal } from '@/hooks/useEthereumLogin';
import BlingIcon from "@/components/icons/BlingIcon";
import CflrIcon from "@/components/icons/CflrIcon";
import { truncateString } from "@/utils";
import { useRouter } from "next/router";
import { useSecretExists } from "@/api/agent";

export default function ConnectWalletButton() {
    const router = useRouter();
    const { t } = useTranslation();
    const { account, isConnected } = useWeb3();

    const secretExists = useSecretExists();
    const { openConnectWalletModal } = useConnectWalletModal();

    const onClick = () => {
        openConnectWalletModal((wallet: string) => {
            if (wallet) router.push(secretExists.data === true ? '/' : '/configure');
        })
    }

    return (
        <>
            {account && isConnected
                ? <Button
                    variant="outline"
                    radius="xl"
                    size="md"
                    onClick={() => openConnectWalletModal()}
                    rightSection={<CflrIcon width="30" height="30" />}
                    className="h-auto text-black border-gray-200 pr-1"
                    classNames={{
                        section: 'my-1 border-l border-gray-200 pl-3'
                    }}
                    fw={400}
                >
                    {truncateString(account)}
                </Button>
                : <Button
                    size="md"
                    onClick={onClick}
                    radius="xl"
                    rightSection={<BlingIcon width="14" height="14" />}
                >
                    <Text size="sm">{t('connect_wallet_button.title')}</Text>
                </Button>
            }
        </>
    );
}
