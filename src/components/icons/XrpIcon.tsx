import { IIconProps } from "@/types";

const XrpIcon = (props: IIconProps) => {
    return (
        <svg
            viewBox="0 0 657 657"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="328.5" cy="328.5" r="328.5"/>
            <path
                d="m478.4 144.5h61.3l-127.6 132.3c-46.2 47.9-121.1 47.9-167.2 0l-127.6-132.3h61.3l96.9 100.5c29.3 30.3 76.7 30.3 105.9 0zm-300.6 368h-61.3l128.4-133.2c46.2-47.9 121.1-47.9 167.3 0l128.4 133.2h-61.3l-97.7-101.4c-29.3-30.3-76.7-30.3-105.9 0z"
                fill="#fff"
            />
        </svg>
    );
};

export default XrpIcon;
