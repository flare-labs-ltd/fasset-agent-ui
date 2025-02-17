import { useMantineColorScheme, type MantineColorScheme } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { COLOR_SCHEME } from "@/constants";

interface ISiteMode {
    className?: string;
}

export default function SiteMode({ className }: ISiteMode) {
    const isMounted = useMounted();
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    if (!isMounted) return null;

    return (
        <div className={`${className ?? ''} cursor-pointer`}>
            {colorScheme === COLOR_SCHEME.DARK
                ? <IconSun
                    size={24}
                    onClick={() => setColorScheme(COLOR_SCHEME.LIGHT as MantineColorScheme)}
                />
                : <IconMoon
                    size={24}
                    onClick={() => setColorScheme(COLOR_SCHEME.DARK as MantineColorScheme)}
                />
            }
        </div>
    )
}
