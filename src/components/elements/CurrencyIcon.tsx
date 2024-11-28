import React from "react";
import CflrIcon from "@/components/icons/CflrIcon";
import UsdtIcon from "@/components/icons/UsdtIcon";
import UsdcIcon from "@/components/icons/UsdcIcon";
import EthIcon from "@/components/icons/EthIcon";
import FTestDogeIcon from "@/components/icons/FTestDogeIcon";
import FTestXrpIcon from "@/components/icons/FTestXrpIcon";
import FTestBtcIcon from "@/components/icons/FTestBtcIcon";
import SgbIcon from "@/components/icons/SgbIcon";

export default function CurrencyIcon({ currency, width = '40', height = '40', className }: { currency: string, width?: string, height?: string, className?: string, style?: any }) {
    if (!currency) {
        return null;
    }

    switch (currency.toLowerCase()) {
        case 'testusdt':
            return <UsdtIcon width={width} height={height} className={className} />;
        case 'testusdc':
            return <UsdcIcon width={width} height={height} className={className} />;
        case 'testeth':
            return <EthIcon width={width} height={height} className={className} />;
        case 'cflr':
            return <CflrIcon width={width} height={height} className={className} />;
        case 'ftestxrp':
            return <FTestXrpIcon width={width} height={height} className={className} />;
        case 'ftestbtc':
            return <FTestBtcIcon width={width} height={height} className={className} />;
        case 'ftestdoge':
            return <FTestDogeIcon width={width} height={height} className={className} />;
        case 'sgb':
            return <SgbIcon width={width} height={height} className={className} />;
    }

    return null;
}
