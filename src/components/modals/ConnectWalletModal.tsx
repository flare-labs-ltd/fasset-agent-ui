import {
    Modal,
    Stack,
    Text,
    Group
} from "@mantine/core";
import { useTranslation, Trans } from "react-i18next";
import { enabledWallets } from "@/connectors/connectors";
import SelectWalletButton from "@/components/elements/SelectWalletButton";

interface IConnectWalletModal {
    opened: boolean;
    onClose: () => void;
}

export default function ConnectWalletModal({ opened, onClose }: IConnectWalletModal) {
    const { t } = useTranslation();

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
                        c="var(--flr-black)"
                        components={[
                            <Text
                                size="xs"
                                component="a"
                                target="_blank"
                                href="https://flare.xyz/privacy-policy/"
                                c="#E62058"
                                aria-label="Terms of Service"
                                key="https://flare.xyz/privacy-policy/"
                            />
                        ]}
                    />
                </Group>
            </Stack>
        </Modal>
    );
}
