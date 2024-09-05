/// <amd-module name="@scom/scom-multicall/contracts/MultiCall.json.ts" />
declare module "@scom/scom-multicall/contracts/MultiCall.json.ts" {
    const _default: {
        abi: {
            inputs: ({
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            } | {
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
            })[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        }[];
        bytecode: string;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-multicall/contracts/MultiCall.ts" />
declare module "@scom/scom-multicall/contracts/MultiCall.ts" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IMulticallWithGasLimitationParams {
        calls: {
            to: string;
            data: string;
        }[];
        gasBuffer: number | BigNumber;
    }
    export class MultiCall extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        gasLeft: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        gaslimit: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        multicall: {
            (calls: {
                to: string;
                data: string;
            }[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (calls: {
                to: string;
                data: string;
            }[], options?: TransactionOptions) => Promise<string[]>;
        };
        multicallWithGas: {
            (calls: {
                to: string;
                data: string;
            }[], options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (calls: {
                to: string;
                data: string;
            }[], options?: TransactionOptions) => Promise<{
                results: string[];
                gasUsed: BigNumber[];
            }>;
        };
        multicallWithGasLimitation: {
            (params: IMulticallWithGasLimitationParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IMulticallWithGasLimitationParams, options?: TransactionOptions) => Promise<{
                results: string[];
                lastSuccessIndex: BigNumber;
            }>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/scom-multicall/contracts/index.ts" />
declare module "@scom/scom-multicall/contracts/index.ts" {
    export { MultiCall } from "@scom/scom-multicall/contracts/MultiCall.ts";
}
/// <amd-module name="@scom/scom-multicall/utils.ts" />
declare module "@scom/scom-multicall/utils.ts" {
    export interface IMulticallInfo {
        chainId: number;
        contractAddress: string;
        gasBuffer: string;
    }
    export function getMulticallInfoList(): {
        chainId: number;
        contractAddress: string;
        gasBuffer: string;
    }[];
    export function getMulticallInfo(chainId: number): {
        chainId: number;
        contractAddress: string;
        gasBuffer: string;
    };
}
/// <amd-module name="@scom/scom-multicall" />
declare module "@scom/scom-multicall" {
    import * as Contracts from "@scom/scom-multicall/contracts/index.ts";
    export { Contracts };
    import { IWallet } from '@ijstech/eth-wallet';
    export interface IDeployOptions {
    }
    export interface IDeployResult {
        multicall: string;
    }
    export var DefaultDeployOptions: IDeployOptions;
    export function deploy(wallet: IWallet, options: IDeployOptions, onProgress: (msg: string) => void): Promise<IDeployResult>;
    const _default_1: {
        Contracts: typeof Contracts;
        deploy: typeof deploy;
        DefaultDeployOptions: IDeployOptions;
    };
    export default _default_1;
    export { IMulticallInfo, getMulticallInfoList, getMulticallInfo } from "@scom/scom-multicall/utils.ts";
}
