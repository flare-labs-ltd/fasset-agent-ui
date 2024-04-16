

interface IIconProps {
    width?: string;
    height?: string;
}

const CoinbaseWalletIcon = (props: IIconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={56} height={56} viewBox="0 0 56 56" fill="none" {...props}>
            <path
                d="M27.9993 4.6665C15.103 4.6665 4.66602 15.1034 4.66602 27.9998C4.66602 40.8962 15.103 51.3332 27.9993 51.3332C40.8957 51.3332 51.3327 40.8962 51.3327 27.9998C51.3327 15.1034 40.8957 4.6665 27.9993 4.6665ZM27.9993 41.653C20.4633 41.653 14.3462 35.5359 14.3462 27.9998C14.3462 20.4638 20.4633 14.3467 27.9993 14.3467C35.5354 14.3467 41.6525 20.4638 41.6525 27.9998C41.6525 35.5359 35.5354 41.653 27.9993 41.653Z"
                fill="url(#paint0_linear)"
            />
            <path
                d="M31.3106 32.3827H24.689C24.1214 32.3827 23.6484 31.9097 23.6484 31.3421V24.689C23.6484 24.1214 24.1214 23.6484 24.689 23.6484H31.3421C31.9097 23.6484 32.3827 24.1214 32.3827 24.689V31.3421C32.3827 31.9097 31.9097 32.3827 31.3106 32.3827Z"
                fill="#2059EB"
            />
            <defs>
                <linearGradient id="paint0_linear" x1="27.9993" y1="51.3332" x2="27.9993" y2="4.6665" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1447EA" />
                    <stop offset={1} stopColor="#2B65FB" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default CoinbaseWalletIcon;
