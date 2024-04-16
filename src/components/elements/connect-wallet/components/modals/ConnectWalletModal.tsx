import {
    Modal,
    Stack,
    Text,
    Group,
    useMantineTheme
} from '@mantine/core';
import { useTranslation, Trans } from 'react-i18next';
import { enabledWallets } from '../../connectors/connectors';
import SelectWalletButton from "../elements/SelectWalletButton";

interface IConnectWalletModal {
    opened: boolean;
    onClose: () => void;
}

export default function ConnectWalletModal({ opened, onClose }: IConnectWalletModal): JSX.Element {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    let showBifrostWallet = false;
    if (typeof window !== 'undefined') {
        // @ts-ignore
        showBifrostWallet = window && window.ethereum && window.ethereum.isBifrost;
    }

    return (
        <Modal
            opened={opened}
            title={<Text fw={700}>{t('connect_wallet_modal.title')}</Text>}
            onClose={onClose}
            centered
            radius="md"
            overlayProps={{ blur: 6, opacity: 0 }}
            padding="md"
        >
            <Stack>
                <Stack justify="flex-start">
                    <SelectWalletButton
                        wallet={showBifrostWallet ? enabledWallets.bifrost : enabledWallets.metamask}
                    />
                    <SelectWalletButton
                        wallet={enabledWallets.walletConnect}
                    />
                    <SelectWalletButton
                        wallet={enabledWallets.coinbase}
                    />
                </Stack>
                <Group pl="sm" gap={0}>
                    <Trans
                        i18nKey="connect_wallet_modal.term_of_service_label"
                        parent={Text}
                        size="xs"
                        c={theme.colors.flare[6]}
                        components={[
                            <Text
                                size="xs"
                                component="a"
                                target="_blank"
                                href="https://flare.xyz/privacy-policy/"
                                c="#E62058"
                                aria-label="Terms of Service"
                            />
                        ]}
                    />
                </Group>
            </Stack>
        </Modal>
    );
}
