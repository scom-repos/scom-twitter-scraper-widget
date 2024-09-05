define("@scom/scom-multicall/contracts/MultiCall.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-multicall/contracts/MultiCall.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [], "name": "gasLeft", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "gaslimit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MultiCall.Call[]", "name": "calls", "type": "tuple[]" }], "name": "multicall", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MultiCall.Call[]", "name": "calls", "type": "tuple[]" }], "name": "multicallWithGas", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }, { "internalType": "uint256[]", "name": "gasUsed", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MultiCall.Call[]", "name": "calls", "type": "tuple[]" }, { "internalType": "uint256", "name": "gasBuffer", "type": "uint256" }], "name": "multicallWithGasLimitation", "outputs": [{ "internalType": "bytes[]", "name": "results", "type": "bytes[]" }, { "internalType": "uint256", "name": "lastSuccessIndex", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }
        ],
        "bytecode": "608060405234801561001057600080fd5b506108bd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063489dba1611610050578063489dba1614610092578063caa5c23f146100b3578063d699fe15146100d357610067565b80632a7228391461006c5780632ddb301b1461008a575b600080fd5b6100746100f4565b6040516100819190610827565b60405180910390f35b6100746100f8565b6100a56100a036600461067c565b610100565b6040516100819291906107bc565b6100c66100c136600461067c565b610280565b60405161008191906107a2565b6100e66100e13660046106b7565b61039a565b604051610081929190610805565b4590565b60005a905090565b606080825167ffffffffffffffff8111801561011b57600080fd5b5060405190808252806020026020018201604052801561014f57816020015b606081526020019060019003908161013a5790505b509150825167ffffffffffffffff8111801561016a57600080fd5b50604051908082528060200260200182016040528015610194578160200160208202803683370190505b50905060005b835181101561027a5760005a90508482815181106101b457fe5b60200260200101516000015173ffffffffffffffffffffffffffffffffffffffff168583815181106101e257fe5b6020026020010151602001516040516101fb9190610786565b6000604051808303816000865af19150503d8060008114610238576040519150601f19603f3d011682016040523d82523d6000602084013e61023d565b606091505b50905084838151811061024c57fe5b60200260200101819052505a810383838151811061026657fe5b60209081029190910101525060010161019a565b50915091565b6060815167ffffffffffffffff8111801561029a57600080fd5b506040519080825280602002602001820160405280156102ce57816020015b60608152602001906001900390816102b95790505b50905060005b8251811015610394578281815181106102e957fe5b60200260200101516000015173ffffffffffffffffffffffffffffffffffffffff1683828151811061031757fe5b6020026020010151602001516040516103309190610786565b6000604051808303816000865af19150503d806000811461036d576040519150601f19603f3d011682016040523d82523d6000602084013e610372565b606091505b50905082828151811061038157fe5b60209081029190910101526001016102d4565b50919050565b60606000835167ffffffffffffffff811180156103b657600080fd5b506040519080825280602002602001820160405280156103ea57816020015b60608152602001906001900390816103d55790505b50915060005b84518110156104bf5784818151811061040557fe5b60200260200101516000015173ffffffffffffffffffffffffffffffffffffffff1685828151811061043357fe5b60200260200101516020015160405161044c9190610786565b6000604051808303816000865af19150503d8060008114610489576040519150601f19603f3d011682016040523d82523d6000602084013e61048e565b606091505b50905083828151811061049d57fe5b6020026020010181905250835a10156104b75790506104e6565b6001016103f0565b505082517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff015b9250929050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461051157600080fd5b92915050565b600082601f830112610527578081fd5b813567ffffffffffffffff8082111561053e578283fd5b602061054d8182850201610830565b838152935080840185820160005b858110156105e957813588016040807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0838d0301121561059a57600080fd5b6105a381610830565b6105af8c8885016104ed565b81529082013590878211156105c357600080fd5b6105d18c88848601016105f5565b8188015285525050918301919083019060010161055b565b50505050505092915050565b600082601f830112610605578081fd5b813567ffffffffffffffff81111561061b578182fd5b61064c60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601610830565b915080825283602082850101111561066357600080fd5b8060208401602084013760009082016020015292915050565b60006020828403121561068d578081fd5b813567ffffffffffffffff8111156106a3578182fd5b6106af84828501610517565b949350505050565b600080604083850312156106c9578081fd5b823567ffffffffffffffff8111156106df578182fd5b6106eb85828601610517565b95602094909401359450505050565b60008282518085526020808601955080818302840101818601855b84811015610779577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe080878503018a528251805180865261075b81888801898501610857565b9a86019a601f01909116939093018401925090830190600101610715565b5090979650505050505050565b60008251610798818460208701610857565b9190910192915050565b6000602082526107b560208301846106fa565b9392505050565b6000604082526107cf60408301856106fa565b828103602084810191909152845180835285820192820190845b81811015610779578451835293830193918301916001016107e9565b60006040825261081860408301856106fa565b90508260208301529392505050565b90815260200190565b60405181810167ffffffffffffffff8111828210171561084f57600080fd5b604052919050565b60005b8381101561087257818101518382015260200161085a565b83811115610881576000848401525b5050505056fea2646970667358221220ccb586539a329f28b3517e4840bb3276779c0e37173b01eb6e1862b7b5762e5f64736f6c634300060c0033"
    };
});
define("@scom/scom-multicall/contracts/MultiCall.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-multicall/contracts/MultiCall.json.ts"], function (require, exports, eth_contract_1, MultiCall_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MultiCall = void 0;
    class MultiCall extends eth_contract_1.Contract {
        constructor(wallet, address) {
            super(wallet, address, MultiCall_json_1.default.abi, MultiCall_json_1.default.bytecode);
            this.assign();
        }
        deploy(options) {
            return this.__deploy([], options);
        }
        assign() {
            let gasLeft_call = async (options) => {
                let result = await this.call('gasLeft', [], options);
                return new eth_contract_1.BigNumber(result);
            };
            this.gasLeft = gasLeft_call;
            let gaslimit_call = async (options) => {
                let result = await this.call('gaslimit', [], options);
                return new eth_contract_1.BigNumber(result);
            };
            this.gaslimit = gaslimit_call;
            let multicall_send = async (calls, options) => {
                let result = await this.send('multicall', [calls.map(e => ([e.to, this.wallet.utils.stringToBytes(e.data)]))], options);
                return result;
            };
            let multicall_call = async (calls, options) => {
                let result = await this.call('multicall', [calls.map(e => ([e.to, this.wallet.utils.stringToBytes(e.data)]))], options);
                return result;
            };
            this.multicall = Object.assign(multicall_send, {
                call: multicall_call
            });
            let multicallWithGas_send = async (calls, options) => {
                let result = await this.send('multicallWithGas', [calls.map(e => ([e.to, this.wallet.utils.stringToBytes(e.data)]))], options);
                return result;
            };
            let multicallWithGas_call = async (calls, options) => {
                let result = await this.call('multicallWithGas', [calls.map(e => ([e.to, this.wallet.utils.stringToBytes(e.data)]))], options);
                return {
                    results: result.results,
                    gasUsed: result.gasUsed.map(e => new eth_contract_1.BigNumber(e))
                };
            };
            this.multicallWithGas = Object.assign(multicallWithGas_send, {
                call: multicallWithGas_call
            });
            let multicallWithGasLimitationParams = (params) => [params.calls.map(e => ([e.to, this.wallet.utils.stringToBytes(e.data)])), this.wallet.utils.toString(params.gasBuffer)];
            let multicallWithGasLimitation_send = async (params, options) => {
                let result = await this.send('multicallWithGasLimitation', multicallWithGasLimitationParams(params), options);
                return result;
            };
            let multicallWithGasLimitation_call = async (params, options) => {
                let result = await this.call('multicallWithGasLimitation', multicallWithGasLimitationParams(params), options);
                return {
                    results: result.results,
                    lastSuccessIndex: new eth_contract_1.BigNumber(result.lastSuccessIndex)
                };
            };
            this.multicallWithGasLimitation = Object.assign(multicallWithGasLimitation_send, {
                call: multicallWithGasLimitation_call
            });
        }
    }
    MultiCall._abi = MultiCall_json_1.default.abi;
    exports.MultiCall = MultiCall;
});
define("@scom/scom-multicall/contracts/index.ts", ["require", "exports", "@scom/scom-multicall/contracts/MultiCall.ts"], function (require, exports, MultiCall_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MultiCall = void 0;
    Object.defineProperty(exports, "MultiCall", { enumerable: true, get: function () { return MultiCall_1.MultiCall; } });
});
define("@scom/scom-multicall/utils.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMulticallInfo = exports.getMulticallInfoList = void 0;
    function getMulticallInfoList() {
        const list = [
            {
                chainId: 1,
                contractAddress: '0x8d035edd8e09c3283463dade67cc0d49d6868063',
                gasBuffer: '3000000'
            },
            {
                chainId: 56,
                contractAddress: '0x804708de7af615085203fa2b18eae59c5738e2a9',
                gasBuffer: '3000000'
            },
            {
                chainId: 97,
                contractAddress: '0xFe482bde67982C73D215032184312E4707B437C1',
                gasBuffer: '3000000'
            },
            {
                chainId: 137,
                contractAddress: '0x0196e8a9455a90d392b46df8560c867e7df40b34',
                gasBuffer: '3000000'
            },
            {
                chainId: 250,
                contractAddress: '0xA31bB36c5164B165f9c36955EA4CcBaB42B3B28E',
                gasBuffer: '3000000'
            },
            {
                chainId: 43113,
                contractAddress: '0x40784b92542649DDA13FF97580e8A021aC57b320',
                gasBuffer: '3000000'
            },
            {
                chainId: 43114,
                contractAddress: '0xC4A8B7e29E3C8ec560cd4945c1cF3461a85a148d',
                gasBuffer: '3000000'
            },
            {
                chainId: 80001,
                contractAddress: '0x7810eC500061f5469fF6e1485Ab130045B3af6b0',
                gasBuffer: '3000000'
            },
            {
                chainId: 421613,
                contractAddress: '0xee25cCcc02550DdBF4b90eb06b0D796eBE247E1B',
                gasBuffer: '3000000'
            },
            {
                chainId: 42161,
                contractAddress: '0x11DEE30E710B8d4a8630392781Cc3c0046365d4c',
                gasBuffer: '3000000'
            },
            {
                chainId: 5001,
                contractAddress: '0x78d2856a82ba7037cb98cead2c3990f0e259a26e',
                gasBuffer: '3000000'
            },
            {
                chainId: 3441005,
                contractAddress: '0xd026d7d357c97b995fc186e1600099b82dad7c99',
                gasBuffer: '3000000'
            },
            {
                chainId: 168587773,
                contractAddress: '0xd1fe13ee84508ccd1f97df4b15c73cb96134e29c',
                gasBuffer: '3000000'
            },
        ];
        return list;
    }
    exports.getMulticallInfoList = getMulticallInfoList;
    function getMulticallInfo(chainId) {
        const list = getMulticallInfoList();
        const info = list.find((item) => item.chainId === chainId);
        return info;
    }
    exports.getMulticallInfo = getMulticallInfo;
});
define("@scom/scom-multicall", ["require", "exports", "@scom/scom-multicall/contracts/index.ts", "@scom/scom-multicall/utils.ts"], function (require, exports, Contracts, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMulticallInfo = exports.getMulticallInfoList = exports.deploy = exports.DefaultDeployOptions = exports.Contracts = void 0;
    exports.Contracts = Contracts;
    ;
    ;
    var progressHandler;
    exports.DefaultDeployOptions = {};
    async function deploy(wallet, options, onProgress) {
        let multicall = new Contracts.MultiCall(wallet);
        onProgress('Deploy MultiCall');
        let address = await multicall.deploy();
        onProgress('MultiCall deployed ' + address);
        return {
            multicall: address
        };
    }
    exports.deploy = deploy;
    ;
    exports.default = {
        Contracts,
        deploy,
        DefaultDeployOptions: exports.DefaultDeployOptions
    };
    Object.defineProperty(exports, "getMulticallInfoList", { enumerable: true, get: function () { return utils_1.getMulticallInfoList; } });
    Object.defineProperty(exports, "getMulticallInfo", { enumerable: true, get: function () { return utils_1.getMulticallInfo; } });
});
