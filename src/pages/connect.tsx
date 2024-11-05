import {
    Container,
    Title,
    Text,
    Button,
    Card
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/hooks/useWeb3";
import { useConnectWalletModal } from "@/hooks/useEthereumLogin";
import { useSecretExists } from "@/api/agent";
import BlingIcon from "@/components/icons/BlingIcon";

export default function Connect() {
    const router = useRouter();
    const { openConnectWalletModal } = useConnectWalletModal();
    const { account } = useWeb3();
    const { t } = useTranslation();
    const secretExists = useSecretExists();

    const onSetupAgentClick = async() => {
        if (account) {
            router.push(secretExists.data === true ? '/' : '/configure');
        } else {
            openConnectWalletModal((wallet: string) => {
                if (wallet) router.push(secretExists.data === true ? '/' : '/configure');
            });
        }
    };

    return (
        <Container
            size="xs"
            className="flex flex-col items-center text-center w-full absolute -translate-y-2/4 -translate-x-2/4 top-2/4 left-2/4"
        >
            <Title order={2} fw={700}>{t('setup.title')}</Title>
            <Text c="gray">{t('setup.subtitle')}</Text>
            <Card
                shadow="sm"
                className="mt-8 w-full"
            >
                <Button
                    variant="filled"
                    onClick={onSetupAgentClick}
                    size="lg"
                    fw={300}
                    rightSection={<BlingIcon width="14" height="14" />}
                >
                    {t('setup.setup_agent_button')}
                </Button>
            </Card>
        </Container>
    );
}
