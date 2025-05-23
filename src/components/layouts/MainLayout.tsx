import {
    AppShell,
    Container,
    Title,
    Text,
    Menu,
    Button,
    rem,
} from "@mantine/core";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
    IconLifebuoy,
    IconAt,
    IconBrandTelegram,
} from "@tabler/icons-react";
import ConnectWalletButton from "@/components/elements/ConnectWalletButton";
import LogoIcon from "@/components/icons/LogoIcon";
import FlrIcon from "@/components/icons/FlrIcon";
import SiteMode from "@/components/elements/SiteMode";
import { useWeb3 } from "@/hooks/useWeb3";

export interface ILayout {
    children?: React.ReactNode;
}

export default function Layout({ children, ...props }: ILayout) {
    const { t } = useTranslation();
    const { isAuthenticated } = useWeb3();
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
                        className="flex flex-wrap justify-between p-1 px-4 sm:px-8 w-full items-center mb-8 bg-[var(--flr-white)]"
                    >
                        <div className="flex items-center">
                            <LogoIcon width="60" height="60" />
                            <div className="ml-3">
                                <Title
                                    order={4}
                                    fw={700}
                                >
                                    {t('layout.header.title')}
                                </Title>
                                <div className="flex items-center">
                                    <FlrIcon width="20" height="20" />
                                    <Text className="ml-1">{t('layout.header.beta_label')}</Text>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mt-2 ml-auto">
                            <SiteMode className="mr-3" />
                            <Menu
                                radius={16}
                            >
                                <Menu.Target>
                                    <Button
                                        variant="outline"
                                        size="md"
                                        className="border-gray-200 dark:border-[var(--flr-black)]"
                                        fw={400}
                                        leftSection={<IconLifebuoy style={{ width: rem(20), height: rem(20) }} />}
                                    >
                                        {t('layout.header.support_button')}
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown className="p-2">
                                    <Menu.Item
                                        component={Link}
                                        href={`mailto:${t('layout.header.support_email')}`}
                                        leftSection={<IconAt style={{ width: rem(20), height: rem(20) }} />}
                                    >
                                        {t('layout.header.email_label')}
                                    </Menu.Item>
                                    <Menu.Item
                                        component={Link}
                                        href={t('layout.header.telegram_url')}
                                        target="_blank"
                                        leftSection={<IconBrandTelegram style={{ width: rem(20), height: rem(20) }} />}
                                    >
                                        {t('layout.header.telegram_label')}
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </div>
                    </Container>
                    <Container fluid className="flex flex-1 w-full">
                        <div className="relative w-full">
                            {children}
                        </div>
                    </Container>
                    <Container
                        fluid
                        className="flex p-3 px-5 sm:px-[2.5rem] w-full mt-2"
                    >
                        <Text
                            size="sm"
                            c="var(--flr-black)"
                            className="mr-4"
                        >
                            {t('layout.footer.title')}
                        </Text>
                        {version &&
                            <Text
                                size="sm"
                                c="var(--flr-gray)"
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
