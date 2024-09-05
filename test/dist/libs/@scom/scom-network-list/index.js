define("@scom/scom-network-list", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNetworkList = void 0;
    // import { application } from '@ijstech/components';
    let moduleDir = '';
    if (typeof window !== 'undefined') {
        const application = window['application'];
        moduleDir = application.currentModuleDir;
    }
    function fullPath(path) {
        if (path.indexOf('://') > 0)
            return path;
        return `${moduleDir}/${path}`;
    }
    function getNetworkList() {
        return [
            {
                chainId: 1,
                chainName: "Ethereum",
                rpcUrls: ['https://mainnet.infura.io/v3/{INFURA_ID}'],
                blockExplorerUrls: ['https://etherscan.io/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/ethereumNetwork.svg')
            },
            {
                chainId: 56,
                chainName: 'BNB Chain',
                rpcUrls: ['https://bsc-dataseed.binance.org'],
                blockExplorerUrls: ['https://bscscan.com'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'BNB',
                    symbol: 'BNB'
                },
                image: fullPath('img/bscMainnet.svg')
            },
            {
                chainId: 97,
                chainName: 'BNB Chain Testnet',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                blockExplorerUrls: ['https://testnet.bscscan.com'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'BNB',
                    symbol: 'BNB'
                },
                image: fullPath('img/bscMainnet.svg')
            },
            {
                chainId: 137,
                chainName: "Polygon",
                rpcUrls: ['https://rpc.ankr.com/polygon'],
                blockExplorerUrls: ['https://polygonscan.com/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'MATIC',
                    symbol: 'MATIC'
                },
                image: fullPath('img/polygon.svg')
            },
            {
                chainId: 1287,
                chainName: 'Moonbeam Testnet',
                rpcUrls: ['https://rpc.testnet.moonbeam.network'],
                blockExplorerUrls: ['https://moonbase-blockscout.testnet.moonbeam.network'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'MOON',
                    symbol: 'MOON'
                }
            },
            {
                chainId: 25,
                chainName: "Cronos",
                rpcUrls: ['https://evm.cronos.org'],
                blockExplorerUrls: ['https://cronoscan.com/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'CRO',
                    symbol: 'CRO'
                },
                image: fullPath('img/cronosMainnet.svg')
            },
            {
                chainId: 338,
                chainName: "Cronos Testnet",
                rpcUrls: ['https://evm-t3.cronos.org'],
                blockExplorerUrls: ['https://testnet.cronoscan.com/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'CRO',
                    symbol: 'CRO'
                },
                image: fullPath('img/cronosMainnet.svg')
            },
            {
                chainId: 80001,
                chainName: "Mumbai Testnet",
                rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'MATIC',
                    symbol: 'MATIC'
                },
                image: fullPath('img/polygon.svg')
            },
            {
                chainId: 43113,
                chainName: "Avalanche FUJI Testnet",
                rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://testnet.snowtrace.io/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'AVAX',
                    symbol: 'AVAX'
                },
                image: fullPath('img/avax.svg')
            },
            {
                chainId: 43114,
                chainName: "Avalanche",
                rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://snowtrace.io/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'AVAX',
                    symbol: 'AVAX'
                },
                image: fullPath('img/avax.svg')
            },
            {
                chainId: 4002,
                chainName: "Fantom Testnet",
                rpcUrls: ['https://rpc.testnet.fantom.network/'],
                blockExplorerUrls: ['https://testnet.ftmscan.com/', 'https://explorer.testnet.fantom.network/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'FTM',
                    symbol: 'FTM'
                },
                image: fullPath('img/fantom-ftm-logo.svg')
            },
            {
                chainId: 250,
                chainName: "Fantom",
                rpcUrls: ['https://rpc.ftm.tools/'],
                blockExplorerUrls: ['https://ftmscan.com/', 'https://explorer.fantom.network/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'FTM',
                    symbol: 'FTM'
                },
                image: fullPath('img/fantom-ftm-logo.svg')
            },
            {
                chainId: 13370,
                chainName: "AminoX Testnet",
                rpcUrls: ['https://aminoxtestnet.node.alphacarbon.network'],
                blockExplorerUrls: ['https://aminoxtestnet.blockscout.alphacarbon.network/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'TACT',
                    symbol: 'TACT'
                },
                image: fullPath('img/aminoXTestnet.svg')
            },
            {
                chainId: 421613,
                chainName: "Arbitrum Goerli Testnet",
                rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://goerli.arbiscan.io/tx/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/arbitrum.svg')
            },
            {
                chainId: 42161,
                chainName: "Arbitrum One",
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/tx/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/arbitrum.svg')
            },
            {
                chainId: 10,
                chainName: "Optimism",
                rpcUrls: ['https://mainnet.optimism.io'],
                blockExplorerUrls: ['https://optimistic.etherscan.io/tx/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/optimism.svg')
            },
            {
                chainId: 420,
                chainName: "Optimism Goerli",
                rpcUrls: ['https://goerli.optimism.io'],
                blockExplorerUrls: ['https://goerli-explorer.optimism.io/tx/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/optimism.svg')
            },
            {
                chainId: 324,
                chainName: "zkSync Era",
                rpcUrls: ['https://mainnet.era.zksync.io'],
                blockExplorerUrls: ['https://explorer.zksync.io/tx/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/zkSyncEra.svg')
            },
            {
                chainId: 280,
                chainName: "zkSync Era Testnet",
                rpcUrls: ['https://testnet.era.zksync.dev'],
                blockExplorerUrls: ['https://goerli.explorer.zksync.io/tx/'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/zkSyncEra.svg')
            },
            {
                chainId: 1442,
                chainName: "Polygon zkEVM Testnet",
                rpcUrls: ['https://rpc.public.zkevm-test.net'],
                blockExplorerUrls: ['https://testnet-zkevm.polygonscan.com'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/polygonZkEvm.svg')
            },
            {
                chainId: 5000,
                chainName: "Mantle",
                rpcUrls: ['https://rpc.mantle.xyz'],
                blockExplorerUrls: ['https://explorer.mantle.xyz'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'MNT',
                    symbol: 'MNT'
                },
                image: fullPath('img/mantle.svg')
            },
            {
                chainId: 5001,
                chainName: "Mantle Testnet",
                rpcUrls: ['https://rpc.testnet.mantle.xyz'],
                blockExplorerUrls: ['https://explorer.testnet.mantle.xyz'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'MNT',
                    symbol: 'MNT'
                },
                image: fullPath('img/mantle.svg')
            },
            {
                chainId: 3441005,
                chainName: "Manta Testnet",
                rpcUrls: ['https://pacific-rpc.testnet.manta.network/http'],
                blockExplorerUrls: ['https://pacific-explorer.testnet.manta.network'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'MANTA',
                    symbol: 'MANTA'
                },
                image: fullPath('img/manta.svg')
            },
            {
                chainId: 169,
                chainName: "Manta",
                rpcUrls: ['https://pacific-rpc.manta.network/http'],
                blockExplorerUrls: ['https://pacific-explorer.manta.network'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/manta.svg')
            },
            {
                chainId: 168587773,
                chainName: "Blast Sepolia",
                rpcUrls: ['https://sepolia.blast.io'],
                blockExplorerUrls: ['https://testnet.blastscan.io'],
                nativeCurrency: {
                    decimals: 18,
                    name: 'ETH',
                    symbol: 'ETH'
                },
                image: fullPath('img/blast.svg')
            }
        ];
    }
    exports.default = getNetworkList;
    exports.getNetworkList = getNetworkList;
});
