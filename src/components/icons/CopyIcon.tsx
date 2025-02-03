import { rem, Popover, Text } from "@mantine/core";
import { copyToClipboard } from "@/utils";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ICopyIcon {
    text: string;
    color?: string;
}

export default function CopyIcon({ text, color = 'var(--flr-black)' }: ICopyIcon) {
    const { t } = useTranslation();
    const [isPopoverActive, setIsPopoverActive] = useState<boolean>(false);

    const onClick = (text: string) => {
        setIsPopoverActive(true);
        setTimeout(() => {
            setIsPopoverActive(false);
        }, 800);
        copyToClipboard(text);
    }

    return (
        <Popover
            withArrow
            opened={isPopoverActive}
            onChange={() => setIsPopoverActive(false)}
        >
            <Popover.Target>
                <IconCopy
                    color={color}
                    style={{ width: rem(15), height: rem(15) }}
                    onClick={() => onClick(text)}
                    className="ml-2 cursor-pointer"
                />
            </Popover.Target>
            <Popover.Dropdown className="p-2 bg-black text-white">
                <Text size="xs">{t('copy_icon.copied_label')}</Text>
            </Popover.Dropdown>
        </Popover>
    );
}
