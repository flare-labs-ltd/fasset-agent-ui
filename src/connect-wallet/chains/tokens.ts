import { getCoston2ContractAddress, getCostonContractAddress, getFlareContractAddress, getSongbirdContractAddress } from '@/contracts/utils';
import { WatchAssetParameters } from '@web3-react/types';

interface ITokens {
    [name: string]: WatchAssetParameters;
}

export const tokens: ITokens = {
    16: {
        address: getCostonContractAddress('WNat'),
        symbol: 'WCFLR',
        decimals: 18,
        image: '', // do we have an image for it?
    },

    19: {
        address: getSongbirdContractAddress('WNat'),
        symbol: 'WSGB',
        decimals: 18,
        image: '', // do we have an image for it?
    },

    14: {
        address: getFlareContractAddress('WNat'),
        symbol: 'WFLR',
        decimals: 18,
        image: '', // do we have an image for it?
    },

    114: {
        address: getCoston2ContractAddress('WNat'),
        symbol: 'WC2FLR',
        decimals: 18,
        image: '', // do we have an image for it?
    },
};
