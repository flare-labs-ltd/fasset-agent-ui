import {
    AppShell,
    Container,
    Title,
    Text,
    Menu,
    Button,
    rem
} from "@mantine/core";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import ConnectWalletButton from "@/components/elements/ConnectWalletButton";
import LogoIcon from "@/components/icons/LogoIcon";
import FlrIcon from "@/components/icons/FlrIcon";
import Link from "next/link";
import {
    IconLifebuoy,
    IconAt,
    IconBrandTelegram
} from "@tabler/icons-react";

export interface ILayout {
    children?: React.ReactNode;
}

export default function Layout({ children, ...props }: ILayout) {
    const { t } = useTranslation();
    const version = process?.env?.APP_VERSION;

    return (
        <>
            <Head>
                <title>{ t('layout.header.title') }</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#b91d47" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <AppShell>
                <AppShell.Main className="flex flex-col">
                    <Container
                        fluid
                        className="flex flex-wrap justify-between p-1 bg-white px-4 sm:px-8 w-full items-center mb-8"
                    >
                        <div className="flex items-center">
                            <LogoIcon width="60" height="60" />
                            <div className="ml-3">
                                <Title
                                    order={4}
                                >
                                    {t('layout.header.title')}
                                </Title>
                                <div className="flex items-center">
                                    <FlrIcon width="20" height="20" />
                                    <Text className="ml-1">{t('layout.header.beta_label')}</Text>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-2 ml-auto">
                            <Menu
                                radius={16}
                            >
                                <Menu.Target>
                                    <Button
                                        variant="outline"
                                        size="md"
                                        className="mr-3 text-black border-gray-200"
                                        fw={400}
                                        leftSection={<IconLifebuoy style={{ width: rem(20), height: rem(20) }} />}
                                    >
                                        {t('layout.header.support_button')}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown className="p-2">
                                    <Menu.Item
                                        component={Link}
                                        href="mailto:support@flare.network"
                                        leftSection={<IconAt style={{ width: rem(20), height: rem(20) }} />}
                                    >
                                        {t('layout.header.email_label')}
                                    </Menu.Item>
                                    <Menu.Item
                                        component={Link}
                                        href="https://t.me/FlareSupport"
                                        target="_blank"
                                        leftSection={<IconBrandTelegram style={{ width: rem(20), height: rem(20) }} />}
                                    >
                                        {t('layout.header.telegram_label')}
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                            <ConnectWalletButton />
                        </div>
                    </Container>
                    <Container fluid className="flex flex-1 w-full">
                        <div className="relative w-full">
                            {children}
                        </div>
                    </Container>
                    <Container
                        fluid
                        className="flex p-3 px-8 w-full mt-2"
                    >
                        <Text
                            size="sm"
                            c="var(--mantine-color-black)"
                            className="mr-4"
                        >
                            {t('layout.footer.title')}
                        </Text>
                        {version &&
                            <Text
                                size="sm"
                                c="rgba(119, 119, 119, 1)"
                            >
                                v{version}
                            </Text>
                        }
                    </Container>
                </AppShell.Main>
            </AppShell>
        </>
    );
}
