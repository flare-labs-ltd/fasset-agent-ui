import {
    Button,
    Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/lib/connect-wallet/hooks/useWeb3';
import { useConnectWalletModal } from '@/lib/connect-wallet/hooks/useEthereumLogin';

export default function ConnectWalletButton(): JSX.Element {
    const { t } = useTranslation();
    const { account } = useWeb3();
    console.log(account)
    const { openConnectWalletModal } = useConnectWalletModal();

    return (
        <Button
            color="rgba(206, 212, 218, 1)"
            size="md"
            onClick={openConnectWalletModal}
            className="text-black"
        >
            <Text size="sm">{account ? t('connect_wallet_button.connected_label') : t('connect_wallet_button.title')}</Text>
        </Button>
    );
}
