/// <amd-module name="@ijstech/eth-wallet/web3.ts" />
declare module "@ijstech/eth-wallet/web3.ts" {
    import { BigNumber } from 'bignumber.js';
    export type Hex = string | number;
    export type Unit = 'noether' | 'wei' | 'kwei' | 'Kwei' | 'babbage' | 'femtoether' | 'mwei' | 'Mwei' | 'lovelace' | 'picoether' | 'gwei' | 'Gwei' | 'shannon' | 'nanoether' | 'nano' | 'szabo' | 'microether' | 'micro' | 'finney' | 'milliether' | 'milli' | 'ether' | 'kether' | 'grand' | 'mether' | 'gether' | 'tether';
    export type Mixed = string | number | BigNumber | {
        type: string;
        value: string;
    } | {
        t: string;
        v: string | BigNumber | number;
    } | boolean;
    export interface Units {
        noether: string;
        wei: string;
        kwei: string;
        Kwei: string;
        babbage: string;
        femtoether: string;
        mwei: string;
        Mwei: string;
        lovelace: string;
        picoether: string;
        gwei: string;
        Gwei: string;
        shannon: string;
        nanoether: string;
        nano: string;
        szabo: string;
        microether: string;
        micro: string;
        finney: string;
        milliether: string;
        milli: string;
        ether: string;
        kether: string;
        grand: string;
        mether: string;
        gether: string;
        tether: string;
    }
    export interface Utils {
        isBN(value: string | number): boolean;
        isBigNumber(value: BigNumber): boolean;
        toBN(value: number | string): BigNumber;
        toTwosComplement(value: number | string | BigNumber): string;
        isAddress(address: string, chainId?: number): boolean;
        isHex(hex: Hex): boolean;
        isHexStrict(hex: Hex): boolean;
        asciiToHex(string: string, length?: number): string;
        hexToAscii(string: string): string;
        toAscii(string: string): string;
        bytesToHex(bytes: number[]): string;
        numberToHex(value: number | string | BigNumber): string;
        checkAddressChecksum(address: string, chainId?: number): boolean;
        fromAscii(string: string): string;
        fromDecimal(value: string | number): string;
        fromUtf8(string: string): string;
        fromWei(value: string | BigNumber, unit?: Unit): string;
        hexToBytes(hex: Hex): number[];
        hexToNumber(hex: Hex, bigIntOnOverflow?: boolean): number | string;
        hexToNumberString(hex: Hex): string;
        hexToString(hex: Hex): string;
        hexToUtf8(string: string): string;
        keccak256(value: string | BigNumber): string;
        padLeft(value: string | number, characterAmount: number, sign?: string): string;
        padRight(string: string | number, characterAmount: number, sign?: string): string;
        leftPad(string: string | number, characterAmount: number, sign?: string): string;
        rightPad(string: string | number, characterAmount: number, sign?: string): string;
        sha3(value: string | BigNumber): string | null;
        randomHex(bytesSize: number): string;
        utf8ToHex(string: string): string;
        stringToHex(string: string): string;
        toChecksumAddress(address: string, chainId?: number): string;
        toDecimal(hex: Hex): number;
        toHex(value: number | string | BigNumber): string;
        toUtf8(string: string): string;
        toWei(val: BigNumber, unit?: Unit): BigNumber;
        toWei(val: string, unit?: Unit): string;
        isBloom(bloom: string): boolean;
        isInBloom(bloom: string, value: string | Uint8Array): boolean;
        isUserEthereumAddressInBloom(bloom: string, ethereumAddress: string): boolean;
        isContractAddressInBloom(bloom: string, contractAddress: string): boolean;
        isTopicInBloom(bloom: string, topic: string): boolean;
        isTopic(topic: string): boolean;
        _jsonInterfaceMethodToString(abiItem: AbiItem): string;
        soliditySha3(...val: Mixed[]): string | null;
        soliditySha3Raw(...val: Mixed[]): string;
        encodePacked(...val: Mixed[]): string | null;
        getUnitValue(unit: Unit): string;
        unitMap(): Units;
        testAddress(bloom: string, address: string): boolean;
        testTopic(bloom: string, topic: string): boolean;
        getSignatureParameters(signature: string): {
            r: string;
            s: string;
            v: number;
        };
        stripHexPrefix(str: string): string;
        toNumber(value: number | string | BigNumber, bigIntOnOverflow?: boolean): number | string;
    }
    export interface HttpHeader {
        name: string;
        value: string;
    }
    export interface HttpProviderOptions {
        keepAlive?: boolean;
        timeout?: number;
        headers?: HttpHeader[];
        withCredentials?: boolean;
        agent?: HttpAgent;
    }
    export interface HttpAgent {
        http?: string;
        https?: string;
        baseUrl?: string;
    }
    export interface HttpProvider {
        constructor(host: string, options?: HttpProviderOptions): any;
        host: string;
        connected: boolean;
        supportsSubscriptions(): boolean;
        send(payload: any, callback: (error: Error | null, result?: any) => void): void;
        disconnect(): boolean;
    }
    export interface ReconnectOptions {
        auto?: boolean;
        delay?: number;
        maxAttempts?: number;
        onTimeout?: boolean;
    }
    export interface WebsocketProviderOptions {
        host?: string;
        timeout?: number;
        reconnectDelay?: number;
        headers?: any;
        protocol?: string;
        clientConfig?: object;
        requestOptions?: any;
        origin?: string;
        reconnect?: ReconnectOptions;
    }
    export interface JsonRpcPayload {
        jsonrpc: string;
        method: string;
        params?: any[];
        id?: string | number;
    }
    export interface RequestItem {
        payload: JsonRpcPayload;
        callback: (error: any, result: any) => void;
    }
    export interface JsonRpcResponse {
        jsonrpc: string;
        id: string | number;
        result?: any;
        error?: {
            readonly code?: number;
            readonly data?: unknown;
            readonly message: string;
        };
    }
    export interface WebsocketProvider {
        constructor(host: string, options?: WebsocketProviderOptions): any;
        isConnecting(): boolean;
        requestQueue: Map<string, RequestItem>;
        responseQueue: Map<string, RequestItem>;
        connected: boolean;
        connection: any;
        supportsSubscriptions(): boolean;
        send(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void;
        on(type: string, callback: () => void): void;
        once(type: string, callback: () => void): void;
        removeListener(type: string, callback: () => void): void;
        removeAllListeners(type: string): void;
        reset(): void;
        disconnect(code?: number, reason?: string): void;
        connect(): void;
        reconnect(): void;
    }
    export interface RequestArguments {
        method: string;
        params?: any;
        [key: string]: any;
    }
    export interface AbstractProvider {
        sendAsync(payload: JsonRpcPayload, callback?: (error: Error | null, result?: JsonRpcResponse) => Promise<unknown> | void): void;
        send?(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => unknown): void;
        request?(args: RequestArguments): Promise<any>;
        connected?: boolean;
    }
    export type provider = HttpProvider | WebsocketProvider | AbstractProvider | string | null;
    export interface AbiInput {
        name: string;
        type: string;
        indexed?: boolean;
        components?: AbiInput[];
        internalType?: string;
    }
    export interface AbiOutput {
        name: string;
        type: string;
        components?: AbiOutput[];
        internalType?: string;
    }
    export type AbiType = 'function' | 'constructor' | 'event' | 'fallback' | 'receive';
    export type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';
    export interface AbiItem {
        anonymous?: boolean;
        constant?: boolean;
        inputs?: AbiInput[];
        name?: string;
        outputs?: AbiOutput[];
        payable?: boolean;
        stateMutability?: StateMutabilityType;
        type: AbiType;
        gas?: number;
    }
    export interface ContractOptions {
        from?: string;
        gasPrice?: string;
        gas?: number;
        data?: string;
    }
    export type chain = 'mainnet' | 'goerli' | 'kovan' | 'rinkeby' | 'ropsten';
    export type hardfork = 'chainstart' | 'homestead' | 'dao' | 'tangerineWhistle' | 'spuriousDragon' | 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul';
    export interface CustomChainParams {
        name?: string;
        networkId: number;
        chainId: number;
    }
    export interface Common {
        customChain: CustomChainParams;
        baseChain?: chain;
        hardfork?: hardfork;
    }
    export interface TransactionConfig {
        from?: string | number;
        to?: string;
        value?: number | string | BigNumber;
        gas?: number | string;
        gasPrice?: number | string | BigNumber;
        maxPriorityFeePerGas?: number | string | BigNumber;
        maxFeePerGas?: number | string | BigNumber;
        data?: string;
        nonce?: number;
        chainId?: number;
        common?: Common;
        chain?: string;
        hardfork?: string;
    }
    export interface SignedTransaction {
        messageHash?: string;
        r: string;
        s: string;
        v: string;
        rawTransaction?: string;
        transactionHash?: string;
    }
    export interface Sign extends SignedTransaction {
        message: string;
        signature: string;
    }
    export interface EncryptedKeystoreV3Json {
        version: number;
        id: string;
        address: string;
        crypto: {
            ciphertext: string;
            cipherparams: {
                iv: string;
            };
            cipher: string;
            kdf: string;
            kdfparams: {
                dklen: number;
                salt: string;
                n: number;
                r: number;
                p: number;
            };
            mac: string;
        };
    }
    export interface Account {
        address: string;
        privateKey: string;
        signTransaction: (transactionConfig: TransactionConfig) => Promise<SignedTransaction>;
        sign: (data: string) => Sign;
        encrypt: (password: string) => EncryptedKeystoreV3Json;
    }
    export interface SignatureObject {
        messageHash: string;
        r: string;
        s: string;
        v: string;
    }
    export interface AddedAccount extends Account {
        index: number;
    }
    export interface AddAccount {
        address: string;
        privateKey: string;
    }
    export interface WalletBase {
        constructor(accounts: Accounts): any;
        length: number;
        defaultKeyName: string;
        [key: number]: Account;
        create(numberOfAccounts: number, entropy?: string): WalletBase;
        add(account: string | AddAccount): AddedAccount;
        remove(account: string | number): boolean;
        clear(): WalletBase;
        encrypt(password: string): EncryptedKeystoreV3Json[];
        decrypt(keystoreArray: EncryptedKeystoreV3Json[], password: string): WalletBase;
        save(password: string, keyName?: string): boolean;
        load(password: string, keyName?: string): WalletBase;
    }
    export interface Accounts {
        constructor(provider?: provider): any;
        readonly givenProvider: any;
        readonly currentProvider: provider;
        setProvider(provider: provider): boolean;
        create(entropy?: string): Account;
        privateKeyToAccount(privateKey: string, ignoreLength?: boolean): Account;
        signTransaction(transactionConfig: TransactionConfig, privateKey: string): Promise<SignedTransaction>;
        recoverTransaction(signature: string): string;
        hashMessage(message: string): string;
        sign(data: string, privateKey: string): Sign;
        recover(signatureObject: SignatureObject): string;
        recover(message: string, signature: string, preFixed?: boolean): string;
        recover(message: string, v: string, r: string, s: string, preFixed?: boolean): string;
        encrypt(privateKey: string, password: string): EncryptedKeystoreV3Json;
        decrypt(keystoreJsonV3: EncryptedKeystoreV3Json, password: string): Account;
        wallet: WalletBase;
    }
    export type BlockNumber = bigint | string | number | BigNumber | 'latest' | 'pending' | 'earliest' | 'genesis' | 'finalized' | 'safe';
    export interface Options extends ContractOptions {
        address: string;
        jsonInterface: AbiItem[];
    }
    export interface DeployOptions {
        data: string;
        arguments?: any[];
    }
    export interface SendOptions {
        from: string;
        gasPrice?: string;
        gas?: number;
        value?: number | string | BigNumber;
        nonce?: number;
    }
    export interface EventLog {
        event: string;
        address: string;
        returnValues: any;
        logIndex: bigint;
        transactionIndex: bigint;
        transactionHash: string;
        blockHash: string;
        blockNumber: bigint;
        raw?: {
            data: string;
            topics: any[];
        };
    }
    export interface Log {
        address: string;
        data: string;
        topics: string[];
        logIndex: bigint;
        transactionIndex: bigint;
        transactionHash: string;
        blockHash: string;
        blockNumber: bigint;
        removed: boolean;
    }
    export interface TransactionReceipt {
        status: bigint;
        transactionHash: string;
        transactionIndex: bigint;
        blockHash: string;
        blockNumber: bigint;
        from: string;
        to: string;
        contractAddress?: string;
        cumulativeGasUsed: bigint;
        gasUsed: bigint;
        effectiveGasPrice: bigint;
        logs: Log[];
        logsBloom: string;
        events?: {
            [eventName: string]: EventLog;
        };
    }
    export interface ConfirmationObject {
        confirmationNumber: bigint;
        receipt: TransactionReceipt;
        latestBlockHash: string;
    }
    export interface PromiEvent<T> extends Promise<T> {
        once(type: 'sending', handler: (payload: object) => void): PromiEvent<T>;
        once(type: 'sent', handler: (payload: object) => void): PromiEvent<T>;
        once(type: 'transactionHash', handler: (transactionHash: string) => void): PromiEvent<T>;
        once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
        once(type: 'confirmation', handler: (confirmationObject: ConfirmationObject) => void): PromiEvent<T>;
        once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
        once(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash' | 'sent' | 'sending', handler: (error: Error | TransactionReceipt | string | object) => void): PromiEvent<T>;
        on(type: 'sending', handler: (payload: object) => void): PromiEvent<T>;
        on(type: 'sent', handler: (payload: object) => void): PromiEvent<T>;
        on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
        on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
        on(type: 'confirmation', handler: (confirmationObject: ConfirmationObject) => void): PromiEvent<T>;
        on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
        on(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash' | 'sent' | 'sending', handler: (error: Error | TransactionReceipt | string | object) => void): PromiEvent<T>;
    }
    export interface CallOptions {
        from?: string;
        gasPrice?: string;
        gas?: bigint;
    }
    export interface EstimateGasOptions {
        from?: string;
        gas?: bigint;
        value?: number | string | BigNumber;
    }
    export interface ContractSendMethod {
        send(options: SendOptions): PromiEvent<Contract>;
        call(options?: CallOptions): Promise<any>;
        estimateGas(options: EstimateGasOptions): Promise<bigint>;
        estimateGas(): Promise<bigint>;
        estimateGas(options: EstimateGasOptions): Promise<bigint>;
        estimateGas(options: EstimateGasOptions): Promise<bigint>;
        estimateGas(): Promise<bigint>;
        encodeABI(): string;
    }
    export interface EventData {
        returnValues: {
            [key: string]: any;
        };
        raw: {
            data: string;
            topics: string[];
        };
        event: string;
        signature: string;
        logIndex: bigint;
        transactionIndex: bigint;
        transactionHash: string;
        blockHash: string;
        blockNumber: bigint;
        address: string;
    }
    export interface Filter {
        [key: string]: number | string | string[] | number[];
    }
    export interface LogsOptions {
        fromBlock?: BlockNumber;
        address?: string | string[];
        topics?: Array<string | string[] | null>;
    }
    export interface EventOptions extends LogsOptions {
        filter?: Filter;
    }
    export interface PastLogsOptions extends LogsOptions {
        toBlock?: BlockNumber;
    }
    export interface PastEventOptions extends PastLogsOptions {
        filter?: Filter;
    }
    export interface Contract {
        constructor(jsonInterface: AbiItem[], address?: string, options?: ContractOptions): any;
        setProvider(provider: provider, accounts?: Accounts): void;
        defaultAccount: string | null;
        defaultBlock: BlockNumber;
        defaultCommon: Common;
        defaultHardfork: hardfork;
        defaultChain: chain;
        transactionPollingTimeout: number;
        transactionConfirmationBlocks: number;
        transactionBlockTimeout: number;
        handleRevert: boolean;
        options: Options;
        clone(): Contract;
        deploy(options: DeployOptions): ContractSendMethod;
        methods: any;
        once(event: string, callback: (error: Error, event: EventData) => void): void;
        once(event: string, options: EventOptions, callback: (error: Error, event: EventData) => void): void;
        events: any;
        getPastEvents(event: string): Promise<EventData[]>;
        getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
        getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
        getPastEvents(event: string): Promise<EventData[]>;
    }
    export interface IndirectOptions {
        institution: string;
        identifier: string;
    }
    export interface Iban {
        constructor(iban: string): any;
        toAddress(iban: string): string;
        toIban(address: string): string;
        fromAddress(address: string): Iban;
        fromBban(bban: string): Iban;
        createIndirect(options: IndirectOptions): Iban;
        isValid(iban: string): boolean;
        isValid(): boolean;
        isDirect(): boolean;
        isIndirect(): boolean;
        checksum(): string;
        institution(): string;
        client(): string;
        toAddress(): string;
        toString(): string;
    }
    export interface Method {
        name: string;
        call: string;
        params?: number;
        inputFormatter?: Array<(() => void) | null>;
        outputFormatter?: () => void;
        transformPayload?: () => void;
        extraFormatters?: any;
        defaultBlock?: string;
        defaultAccount?: string | null;
        abiCoder?: any;
        handleRevert?: boolean;
    }
    export interface BatchRequest {
        constructor(): any;
        add(method: Method): void;
        execute(): void;
    }
    export interface Extension {
        property?: string;
        methods: Method[];
    }
    export interface RLPEncodedTransaction {
        raw: string;
        tx: {
            nonce: string;
            gasPrice: string;
            gas: string;
            to: string;
            value: string;
            input: string;
            r: string;
            s: string;
            v: string;
            hash: string;
        };
    }
    export interface Personal {
        constructor(provider?: provider): any;
        readonly givenProvider: any;
        readonly currentProvider: provider;
        defaultAccount: string | null;
        defaultBlock: string | number;
        BatchRequest: new () => BatchRequest;
        setProvider(provider: provider): boolean;
        extend(extension: Extension): any;
        newAccount(password: string): Promise<string>;
        sign(dataToSign: string, address: string, password: string): Promise<string>;
        ecRecover(dataThatWasSigned: string, signature: string): Promise<string>;
        signTransaction(transactionConfig: TransactionConfig, password: string): Promise<RLPEncodedTransaction>;
        sendTransaction(transactionConfig: TransactionConfig, password: string): Promise<string>;
        unlockAccount(address: string, password: string, unlockDuration: number): Promise<boolean>;
        lockAccount(address: string): Promise<boolean>;
        getAccounts(): Promise<string[]>;
        importRawKey(privateKey: string, password: string): Promise<string>;
    }
    export interface AbiCoder {
        encodeFunctionSignature(functionName: string | AbiItem): string;
        encodeEventSignature(functionName: string | AbiItem): string;
        encodeParameter(type: any, parameter: any): string;
        encodeParameters(types: any[], paramaters: any[]): string;
        encodeFunctionCall(abiItem: AbiItem, params: string[]): string;
        decodeParameter(type: any, hex: string): {
            [key: string]: any;
        };
        decodeParameters(types: any[], hex: string): {
            [key: string]: any;
        };
        decodeLog(inputs: AbiInput[], hex: string, topics: string[]): {
            [key: string]: string;
        };
    }
    export interface Providers {
        HttpProvider: new (host: string, options?: HttpProviderOptions) => HttpProvider;
        WebsocketProvider: new (host: string, options?: WebsocketProviderOptions) => WebsocketProvider;
        IpcProvider: new (path: string, net: any) => any;
    }
    export interface Network {
        constructor(provider?: provider): any;
        readonly givenProvider: any;
        readonly currentProvider: provider;
        readonly providers: Providers;
        BatchRequest: new () => BatchRequest;
        setProvider(provider: provider): boolean;
        extend(extension: Extension): any;
        getNetworkType(): Promise<string>;
    }
    export interface SubscriptionOptions {
        subscription: string;
        type: string;
        requestManager: any;
    }
    export interface Subscription<T> {
        constructor(options: SubscriptionOptions): any;
        id: string;
        options: SubscriptionOptions;
        callback: () => void;
        arguments: any;
        lastBlock: number;
        subscribe(callback?: (error: Error, result: T) => void): Subscription<T>;
        unsubscribe(callback?: (error: Error, result: boolean) => void): Promise<undefined | boolean>;
        on(type: 'data', handler: (data: T) => void): Subscription<T>;
        on(type: 'changed', handler: (data: T) => void): Subscription<T>;
        on(type: 'connected', handler: (subscriptionId: string) => void): Subscription<T>;
        on(type: 'error', handler: (data: Error) => void): Subscription<T>;
    }
    export interface Syncing {
        StartingBlock: number;
        CurrentBlock: number;
        HighestBlock: number;
        KnownStates: number;
        PulledStates: number;
    }
    export interface BlockHeader {
        number: bigint;
        hash: string;
        parentHash: string;
        nonce: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionsRoot: string;
        stateRoot: string;
        receiptsRoot: string;
        miner: string;
        extraData: string;
        gasLimit: bigint;
        gasUsed: bigint;
        timestamp: bigint;
        baseFeePerGas?: bigint;
    }
    export interface FeeHistoryResult {
        baseFeePerGas: string[];
        gasUsedRatio: number[];
        oldestBlock: bigint;
        reward: string[][];
    }
    export interface BlockTransactionBase extends BlockHeader {
        size: bigint;
        difficulty: bigint;
        totalDifficulty: bigint;
        uncles: string[];
    }
    export interface BlockTransactionString extends BlockTransactionBase {
        transactions: string[];
    }
    export interface AccessTuple {
        address: string;
        storageKeys: string[];
    }
    export type AccessList = AccessTuple[];
    export interface Transaction {
        hash: string;
        nonce: bigint;
        blockHash: string | null;
        blockNumber: bigint | null;
        transactionIndex: bigint | null;
        from: string;
        to: string | null;
        value: string;
        gasPrice: string;
        maxPriorityFeePerGas?: bigint | string | BigNumber;
        maxFeePerGas?: bigint | string | BigNumber;
        gas: bigint;
        input: string;
        chainId?: string;
        accessList?: AccessList;
        v?: string;
        r?: string;
        s?: string;
    }
    export interface BlockTransactionObject extends BlockTransactionBase {
        transactions: Transaction[];
    }
    export interface CreateAccessList {
        accessList: AccessTuple[];
        error?: string;
        gasUsed: string;
    }
    export interface Eth {
        constructor(provider?: provider): any;
        Contract: new (jsonInterface: AbiItem[] | AbiItem, address?: string, options?: ContractOptions) => Contract;
        Iban: new (iban: string) => Iban;
        personal: Personal;
        accounts: Accounts;
        ens: any;
        abi: AbiCoder;
        net: Network;
        readonly givenProvider: any;
        defaultAccount: string | null;
        defaultBlock: BlockNumber;
        defaultCommon: Common;
        defaultHardfork: hardfork;
        defaultChain: chain;
        transactionPollingTimeout: number;
        transactionConfirmationBlocks: number;
        transactionBlockTimeout: number;
        handleRevert: boolean;
        readonly currentProvider: provider;
        setProvider(provider: provider): boolean;
        BatchRequest: new () => BatchRequest;
        readonly providers: Providers;
        extend(extension: Extension): any;
        clearSubscriptions(callback: (error: Error, result: boolean) => void): void;
        subscribe(type: 'logs', options: LogsOptions): Subscription<Log>;
        subscribe(type: 'syncing'): Subscription<Syncing>;
        subscribe(type: 'newBlockHeaders'): Subscription<BlockHeader>;
        subscribe(type: 'pendingTransactions'): Subscription<string>;
        getProtocolVersion(): Promise<string>;
        isSyncing(): Promise<Syncing | boolean>;
        getCoinbase(): Promise<string>;
        isMining(): Promise<boolean>;
        getHashRate(): Promise<number>;
        getNodeInfo(): Promise<string>;
        getChainId(): Promise<bigint>;
        getGasPrice(): Promise<bigint>;
        getFeeHistory(blockCount: number | BigNumber | BigNumber | string, lastBlock: number | BigNumber | BigNumber | string, rewardPercentiles: number[]): Promise<FeeHistoryResult>;
        getAccounts(): Promise<string[]>;
        getBlockNumber(): Promise<bigint>;
        getBalance(address: string): Promise<bigint>;
        getBalance(address: string, defaultBlock: BlockNumber): Promise<bigint>;
        getBalance(address: string): Promise<bigint>;
        getBalance(address: string, defaultBlock: BlockNumber): Promise<bigint>;
        getStorageAt(address: string, position: number | BigNumber | string): Promise<string>;
        getStorageAt(address: string, position: number | BigNumber | string, defaultBlock: BlockNumber): Promise<string>;
        getStorageAt(address: string, position: number | BigNumber | string): Promise<string>;
        getStorageAt(address: string, position: number | BigNumber | string, defaultBlock: BlockNumber): Promise<string>;
        getCode(address: string): Promise<string>;
        getCode(address: string, defaultBlock: BlockNumber): Promise<string>;
        getCode(address: string): Promise<string>;
        getCode(address: string, defaultBlock: BlockNumber): Promise<string>;
        getBlock(blockHashOrBlockNumber: BlockNumber | string): Promise<BlockTransactionString>;
        getBlock(blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: false): Promise<BlockTransactionString>;
        getBlock(blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: true): Promise<BlockTransactionObject>;
        getBlock(blockHashOrBlockNumber: BlockNumber | string): Promise<BlockTransactionString>;
        getBlock(blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: false): Promise<BlockTransactionString>;
        getBlock(blockHashOrBlockNumber: BlockNumber | string, returnTransactionObjects: true): Promise<BlockTransactionObject>;
        getBlockTransactionCount(blockHashOrBlockNumber: BlockNumber | string): Promise<bigint>;
        getBlockUncleCount(blockHashOrBlockNumber: BlockNumber | string): Promise<bigint>;
        getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BigNumber): Promise<BlockTransactionString>;
        getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BigNumber, returnTransactionObjects: boolean): Promise<BlockTransactionObject>;
        getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BigNumber): Promise<BlockTransactionString>;
        getUncle(blockHashOrBlockNumber: BlockNumber | string, uncleIndex: number | string | BigNumber, returnTransactionObjects: boolean): Promise<BlockTransactionObject>;
        getTransaction(transactionHash: string): Promise<Transaction>;
        getPendingTransactions(): Promise<Transaction[]>;
        getTransactionFromBlock(blockHashOrBlockNumber: BlockNumber | string, indexNumber: number | string | BigNumber): Promise<Transaction>;
        getTransactionReceipt(hash: string): Promise<TransactionReceipt>;
        getTransactionCount(address: string): Promise<bigint>;
        getTransactionCount(address: string, defaultBlock: BlockNumber): Promise<bigint>;
        getTransactionCount(address: string): Promise<bigint>;
        getTransactionCount(address: string, defaultBlock: BlockNumber): Promise<bigint>;
        sendTransaction(transactionConfig: TransactionConfig): PromiEvent<TransactionReceipt>;
        sendSignedTransaction(signedTransactionData: string): PromiEvent<TransactionReceipt>;
        sign(dataToSign: string, address: string | number): Promise<string>;
        signTransaction(transactionConfig: TransactionConfig): Promise<RLPEncodedTransaction>;
        signTransaction(transactionConfig: TransactionConfig, address: string): Promise<RLPEncodedTransaction>;
        signTransaction(transactionConfig: TransactionConfig, address: string): Promise<RLPEncodedTransaction>;
        call(transactionConfig: TransactionConfig): Promise<string>;
        call(transactionConfig: TransactionConfig, defaultBlock?: BlockNumber): Promise<string>;
        call(transactionConfig: TransactionConfig): Promise<string>;
        call(transactionConfig: TransactionConfig, defaultBlock: BlockNumber): Promise<string>;
        estimateGas(transactionConfig: TransactionConfig): Promise<bigint>;
        createAccessList(transactionConfig: TransactionConfig): Promise<CreateAccessList>;
        createAccessList(transactionConfig: TransactionConfig, defaultBlock: BlockNumber): Promise<CreateAccessList>;
        getPastLogs(options: PastLogsOptions): Promise<Log[]>;
    }
    export interface IWeb3 {
        eth: Eth;
        utils: Utils;
        currentProvider(): any;
        setProvider(provider: any): any;
    }
    export class Web3 implements IWeb3 {
        readonly eth: Eth;
        readonly utils: Utils;
        static utils: Utils;
        constructor(provider?: any);
        get currentProvider(): any;
        setProvider(provider: any): boolean;
    }
}
declare module "contracts/ERC1155/ERC1155.json" {
    const _default: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        })[];
        bytecode: string;
    };
    export default _default;
}
declare module "contracts/ERC1155/ERC1155" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, Event, TransactionOptions } from "@ijstech/eth-contract";
    export interface IBalanceOfParams {
        account: string;
        id: number | BigNumber;
    }
    export interface IBalanceOfBatchParams {
        accounts: string[];
        ids: (number | BigNumber)[];
    }
    export interface IIsApprovedForAllParams {
        account: string;
        operator: string;
    }
    export interface ISafeBatchTransferFromParams {
        from: string;
        to: string;
        ids: (number | BigNumber)[];
        amounts: (number | BigNumber)[];
        data: string;
    }
    export interface ISafeTransferFromParams {
        from: string;
        to: string;
        id: number | BigNumber;
        amount: number | BigNumber;
        data: string;
    }
    export interface ISetApprovalForAllParams {
        operator: string;
        approved: boolean;
    }
    export class ERC1155 extends _Contract {
        constructor(wallet: IWallet, address?: string);
        deploy(uri: string, options?: TransactionOptions): Promise<string>;
        parseApprovalForAllEvent(receipt: TransactionReceipt): ERC1155.ApprovalForAllEvent[];
        decodeApprovalForAllEvent(event: Event): ERC1155.ApprovalForAllEvent;
        parseTransferBatchEvent(receipt: TransactionReceipt): ERC1155.TransferBatchEvent[];
        decodeTransferBatchEvent(event: Event): ERC1155.TransferBatchEvent;
        parseTransferSingleEvent(receipt: TransactionReceipt): ERC1155.TransferSingleEvent[];
        decodeTransferSingleEvent(event: Event): ERC1155.TransferSingleEvent;
        parseURIEvent(receipt: TransactionReceipt): ERC1155.URIEvent[];
        decodeURIEvent(event: Event): ERC1155.URIEvent;
        balanceOf: {
            (params: IBalanceOfParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        balanceOfBatch: {
            (params: IBalanceOfBatchParams, options?: TransactionOptions): Promise<BigNumber[]>;
        };
        isApprovedForAll: {
            (params: IIsApprovedForAllParams, options?: TransactionOptions): Promise<boolean>;
        };
        safeBatchTransferFrom: {
            (params: ISafeBatchTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ISafeBatchTransferFromParams, options?: TransactionOptions) => Promise<void>;
        };
        safeTransferFrom: {
            (params: ISafeTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ISafeTransferFromParams, options?: TransactionOptions) => Promise<void>;
        };
        setApprovalForAll: {
            (params: ISetApprovalForAllParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ISetApprovalForAllParams, options?: TransactionOptions) => Promise<void>;
        };
        supportsInterface: {
            (interfaceId: string, options?: TransactionOptions): Promise<boolean>;
        };
        uri: {
            (param1: number | BigNumber, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
    export module ERC1155 {
        interface ApprovalForAllEvent {
            account: string;
            operator: string;
            approved: boolean;
            _event: Event;
        }
        interface TransferBatchEvent {
            operator: string;
            from: string;
            to: string;
            ids: BigNumber[];
            values: BigNumber[];
            _event: Event;
        }
        interface TransferSingleEvent {
            operator: string;
            from: string;
            to: string;
            id: BigNumber;
            value: BigNumber;
            _event: Event;
        }
        interface URIEvent {
            value: string;
            id: BigNumber;
            _event: Event;
        }
    }
}
declare module "contracts/ERC20/ERC20.json" {
    const _default_1: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        })[];
        bytecode: string;
    };
    export default _default_1;
}
declare module "contracts/ERC20/ERC20" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, Event, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        name: string;
        symbol: string;
    }
    export interface IAllowanceParams {
        owner: string;
        spender: string;
    }
    export interface IApproveParams {
        spender: string;
        amount: number | BigNumber;
    }
    export interface IDecreaseAllowanceParams {
        spender: string;
        subtractedValue: number | BigNumber;
    }
    export interface IIncreaseAllowanceParams {
        spender: string;
        addedValue: number | BigNumber;
    }
    export interface ITransferParams {
        to: string;
        amount: number | BigNumber;
    }
    export interface ITransferFromParams {
        from: string;
        to: string;
        amount: number | BigNumber;
    }
    export class ERC20 extends _Contract {
        constructor(wallet: IWallet, address?: string);
        deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>;
        parseApprovalEvent(receipt: TransactionReceipt): ERC20.ApprovalEvent[];
        decodeApprovalEvent(event: Event): ERC20.ApprovalEvent;
        parseTransferEvent(receipt: TransactionReceipt): ERC20.TransferEvent[];
        decodeTransferEvent(event: Event): ERC20.TransferEvent;
        allowance: {
            (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        approve: {
            (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IApproveParams, options?: TransactionOptions) => Promise<boolean>;
        };
        balanceOf: {
            (account: string, options?: TransactionOptions): Promise<BigNumber>;
            txData: (account: string, options?: TransactionOptions) => Promise<string>;
        };
        decimals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        decreaseAllowance: {
            (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IDecreaseAllowanceParams, options?: TransactionOptions) => Promise<boolean>;
        };
        increaseAllowance: {
            (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IIncreaseAllowanceParams, options?: TransactionOptions) => Promise<boolean>;
        };
        name: {
            (options?: TransactionOptions): Promise<string>;
        };
        symbol: {
            (options?: TransactionOptions): Promise<string>;
        };
        totalSupply: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        transfer: {
            (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ITransferParams, options?: TransactionOptions) => Promise<boolean>;
        };
        transferFrom: {
            (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ITransferFromParams, options?: TransactionOptions) => Promise<boolean>;
        };
        private assign;
    }
    export module ERC20 {
        interface ApprovalEvent {
            owner: string;
            spender: string;
            value: BigNumber;
            _event: Event;
        }
        interface TransferEvent {
            from: string;
            to: string;
            value: BigNumber;
            _event: Event;
        }
    }
}
declare module "contracts/ERC721/ERC721.json" {
    const _default_2: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        })[];
        bytecode: string;
    };
    export default _default_2;
}
declare module "contracts/ERC721/ERC721" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, Event, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        name: string;
        symbol: string;
    }
    export interface IApproveParams {
        to: string;
        tokenId: number | BigNumber;
    }
    export interface IIsApprovedForAllParams {
        owner: string;
        operator: string;
    }
    export interface ISafeTransferFromParams {
        from: string;
        to: string;
        tokenId: number | BigNumber;
    }
    export interface ISafeTransferFrom_1Params {
        from: string;
        to: string;
        tokenId: number | BigNumber;
        data: string;
    }
    export interface ISetApprovalForAllParams {
        operator: string;
        approved: boolean;
    }
    export interface ITransferFromParams {
        from: string;
        to: string;
        tokenId: number | BigNumber;
    }
    export class ERC721 extends _Contract {
        constructor(wallet: IWallet, address?: string);
        deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>;
        parseApprovalEvent(receipt: TransactionReceipt): ERC721.ApprovalEvent[];
        decodeApprovalEvent(event: Event): ERC721.ApprovalEvent;
        parseApprovalForAllEvent(receipt: TransactionReceipt): ERC721.ApprovalForAllEvent[];
        decodeApprovalForAllEvent(event: Event): ERC721.ApprovalForAllEvent;
        parseTransferEvent(receipt: TransactionReceipt): ERC721.TransferEvent[];
        decodeTransferEvent(event: Event): ERC721.TransferEvent;
        approve: {
            (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: IApproveParams, options?: TransactionOptions) => Promise<void>;
        };
        balanceOf: {
            (owner: string, options?: TransactionOptions): Promise<BigNumber>;
        };
        getApproved: {
            (tokenId: number | BigNumber, options?: TransactionOptions): Promise<string>;
        };
        isApprovedForAll: {
            (params: IIsApprovedForAllParams, options?: TransactionOptions): Promise<boolean>;
        };
        name: {
            (options?: TransactionOptions): Promise<string>;
        };
        ownerOf: {
            (tokenId: number | BigNumber, options?: TransactionOptions): Promise<string>;
        };
        safeTransferFrom: {
            (params: ISafeTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ISafeTransferFromParams, options?: TransactionOptions) => Promise<void>;
        };
        safeTransferFrom_1: {
            (params: ISafeTransferFrom_1Params, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ISafeTransferFrom_1Params, options?: TransactionOptions) => Promise<void>;
        };
        setApprovalForAll: {
            (params: ISetApprovalForAllParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ISetApprovalForAllParams, options?: TransactionOptions) => Promise<void>;
        };
        supportsInterface: {
            (interfaceId: string, options?: TransactionOptions): Promise<boolean>;
        };
        symbol: {
            (options?: TransactionOptions): Promise<string>;
        };
        tokenURI: {
            (tokenId: number | BigNumber, options?: TransactionOptions): Promise<string>;
        };
        transferFrom: {
            (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
            call: (params: ITransferFromParams, options?: TransactionOptions) => Promise<void>;
        };
        private assign;
    }
    export module ERC721 {
        interface ApprovalEvent {
            owner: string;
            approved: string;
            tokenId: BigNumber;
            _event: Event;
        }
        interface ApprovalForAllEvent {
            owner: string;
            operator: string;
            approved: boolean;
            _event: Event;
        }
        interface TransferEvent {
            from: string;
            to: string;
            tokenId: BigNumber;
            _event: Event;
        }
    }
}
declare module "contracts/MultiCall/MultiCall.json" {
    const _default_3: {
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
    export default _default_3;
}
declare module "contracts/MultiCall/MultiCall" {
    import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IMulticallWithGasLimitationParams {
        calls: {
            to: string;
            data: string;
        }[];
        gasBuffer: number | BigNumber;
    }
    export class MultiCall extends _Contract {
        constructor(wallet: IWallet, address?: string);
        deploy(options?: number | BigNumber | TransactionOptions): Promise<string>;
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
/// <amd-module name="@ijstech/eth-wallet/contracts/index.ts" />
declare module "@ijstech/eth-wallet/contracts/index.ts" {
    export { ERC1155 } from "contracts/ERC1155/ERC1155";
    export { ERC20 } from "contracts/ERC20/ERC20";
    export { ERC721 } from "contracts/ERC721/ERC721";
    export { MultiCall } from "contracts/MultiCall/MultiCall";
}
/// <amd-module name="@ijstech/eth-wallet/contract.ts" />
declare module "@ijstech/eth-wallet/contract.ts" {
    /*!-----------------------------------------------------------
    * Copyright (c) IJS Technologies. All rights reserved.
    * Released under dual AGPLv3/commercial license
    * https://ijs.network
    *-----------------------------------------------------------*/
    import { IWallet, TransactionReceipt, Event, IBatchRequestObj } from "@ijstech/eth-wallet/wallet.ts";
    module Contract {
        interface EventType {
            name: string;
        }
        class Contract {
            wallet: IWallet;
            _abi: any;
            _bytecode: any;
            _address: string;
            private _events;
            privateKey: string;
            private abiHash;
            constructor(wallet: IWallet, address?: string, abi?: any, bytecode?: any);
            at(address: string): Contract;
            set address(value: string);
            get address(): string;
            protected decodeEvents(receipt: TransactionReceipt): any[];
            protected parseEvents(receipt: TransactionReceipt, eventName: string): Event[];
            get events(): EventType[];
            getAbiEvents(): any;
            getAbiTopics(eventNames?: string[]): any[];
            scanEvents(fromBlock: number, toBlock: number | string, eventNames?: string[]): Promise<Event[]>;
            batchCall(batchObj: IBatchRequestObj, key: string, methodName: string, params?: any[], options?: any): Promise<void>;
            protected call(methodName: string, params?: any[], options?: any): Promise<any>;
            private _send;
            protected __deploy(params?: any[], options?: any): Promise<string>;
            protected send(methodName: string, params?: any[], options?: any): Promise<TransactionReceipt>;
            protected _deploy(...params: any[]): Promise<string>;
            protected methods(methodName: string, ...params: any[]): Promise<any>;
        }
    }
    export = Contract;
}
/// <amd-module name="@ijstech/eth-wallet/types.ts" />
declare module "@ijstech/eth-wallet/types.ts" {
    /*!-----------------------------------------------------------
   * Copyright (c) IJS Technologies. All rights reserved.
   * Released under dual AGPLv3/commercial license
   * https://ijs.network
   *-----------------------------------------------------------*/
    export interface MessageTypeProperty {
        name: string;
        type: string;
    }
    export type EIP712TypeMap = {
        [type: string]: MessageTypeProperty[];
    };
    export interface IEIP712Domain {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    }
    export enum SignTypedDataVersion {
        V1 = "V1",
        V3 = "V3",
        V4 = "V4"
    }
    export interface MessageTypes {
        EIP712Domain: MessageTypeProperty[];
        [additionalProperties: string]: MessageTypeProperty[];
    }
    export interface TypedMessage<T extends MessageTypes> {
        types: T;
        primaryType: keyof T;
        domain: {
            name?: string;
            version?: string;
            chainId?: number;
            verifyingContract?: string;
            salt?: ArrayBuffer;
        };
        message: Record<string, unknown>;
    }
    export interface IAbiDefinition {
        _abi: any;
    }
    export interface ITokenObject {
        address?: string;
        name: string;
        decimals: number;
        symbol: string;
    }
    namespace nacl {
        interface BoxKeyPair {
            publicKey: Uint8Array;
            secretKey: Uint8Array;
        }
        interface SignKeyPair {
            publicKey: Uint8Array;
            secretKey: Uint8Array;
        }
        interface secretbox {
            (msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
            open(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null;
            readonly keyLength: number;
            readonly nonceLength: number;
            readonly overheadLength: number;
        }
        interface scalarMult {
            (n: Uint8Array, p: Uint8Array): Uint8Array;
            base(n: Uint8Array): Uint8Array;
            readonly scalarLength: number;
            readonly groupElementLength: number;
        }
        namespace boxProps {
            interface open {
                (msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array | null;
                after(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null;
            }
            interface keyPair {
                (): BoxKeyPair;
                fromSecretKey(secretKey: Uint8Array): BoxKeyPair;
            }
        }
        interface box {
            (msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array;
            before(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array;
            after(msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
            open: boxProps.open;
            keyPair: boxProps.keyPair;
            readonly publicKeyLength: number;
            readonly secretKeyLength: number;
            readonly sharedKeyLength: number;
            readonly nonceLength: number;
            readonly overheadLength: number;
        }
        namespace signProps {
            interface detached {
                (msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
                verify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean;
            }
            interface keyPair {
                (): SignKeyPair;
                fromSecretKey(secretKey: Uint8Array): SignKeyPair;
                fromSeed(secretKey: Uint8Array): SignKeyPair;
            }
        }
        interface sign {
            (msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
            open(signedMsg: Uint8Array, publicKey: Uint8Array): Uint8Array | null;
            detached: signProps.detached;
            keyPair: signProps.keyPair;
            readonly publicKeyLength: number;
            readonly secretKeyLength: number;
            readonly seedLength: number;
            readonly signatureLength: number;
        }
        interface hash {
            (msg: Uint8Array): Uint8Array;
            readonly hashLength: number;
        }
    }
    export interface INacl {
        randomBytes(n: number): Uint8Array;
        secretbox: nacl.secretbox;
        scalarMult: nacl.scalarMult;
        box: nacl.box;
        sign: nacl.sign;
        hash: nacl.hash;
        verify(x: Uint8Array, y: Uint8Array): boolean;
        setPRNG(fn: (x: Uint8Array, n: number) => void): void;
    }
}
/// <amd-module name="@ijstech/eth-wallet/constants.ts" />
declare module "@ijstech/eth-wallet/constants.ts" {
    export const EIP712DomainAbi: {
        name: string;
        type: string;
    }[];
    export const TYPED_MESSAGE_SCHEMA: {
        type: string;
        properties: {
            types: {
                type: string;
                additionalProperties: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                            };
                            type: {
                                type: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
            primaryType: {
                type: string;
            };
            domain: {
                type: string;
            };
            message: {
                type: string;
            };
        };
        required: string[];
    };
    export enum ClientWalletEvent {
        AccountsChanged = "accountsChanged",
        ChainChanged = "chainChanged",
        Connect = "connect",
        Disconnect = "disconnect"
    }
    export enum RpcWalletEvent {
        Connected = "connected",
        Disconnected = "disconnected",
        ChainChanged = "chainChanged"
    }
}
/// <amd-module name="@ijstech/eth-wallet/utils.ts" />
declare module "@ijstech/eth-wallet/utils.ts" {
    /*!-----------------------------------------------------------
    * Copyright (c) IJS Technologies. All rights reserved.
    * Released under dual AGPLv3/commercial license
    * https://ijs.network
    *-----------------------------------------------------------*/
    import { BigNumber } from "bignumber.js";
    import { EIP712TypeMap, IEIP712Domain, MessageTypes, TypedMessage } from "@ijstech/eth-wallet/types.ts";
    import { ISendTxEventsOptions } from "@ijstech/eth-wallet/wallet.ts";
    export function initWeb3Lib(): any;
    export function sleep(millisecond: number): Promise<unknown>;
    export function numberToBytes32(value: number | BigNumber, prefix?: boolean): string;
    export function padLeft(string: string, chars: number, sign?: string): string;
    export function padRight(string: string, chars: number, sign?: string): string;
    type stringArray = string | _stringArray;
    interface _stringArray extends Array<stringArray> {
    }
    export function stringToBytes32(value: string | stringArray): string | string[];
    export function stringToBytes(value: string | stringArray, nByte?: number): string | string[];
    export function addressToBytes32(value: string, prefix?: boolean): string;
    export function bytes32ToAddress(value: string): string;
    export function bytes32ToString(value: string): string;
    export function addressToBytes32Right(value: string, prefix?: boolean): string;
    export function toNumber(value: string | number | BigNumber | bigint): number;
    export function toDecimals(value: BigNumber | number | string, decimals?: number): BigNumber;
    export function fromDecimals(value: BigNumber | number | string, decimals?: number): BigNumber;
    export function toString(value: any): any;
    export const nullAddress = "0x0000000000000000000000000000000000000000";
    export function constructTypedMessageData(domain: IEIP712Domain, customTypes: EIP712TypeMap, primaryType: string, message: Record<string, unknown>): TypedMessage<MessageTypes>;
    export function soliditySha3(...val: any[]): any;
    export function toChecksumAddress(address: string): any;
    export function registerSendTxEvents(sendTxEventHandlers: ISendTxEventsOptions): void;
    export function uint8ArrayToHex(byteArray: Uint8Array): string;
    export function stringToUnicodeHex(str: string): string;
    export function hexToString(hex: string): string;
}
/// <amd-module name="@ijstech/eth-wallet/contracts/erc20.ts" />
declare module "@ijstech/eth-wallet/contracts/erc20.ts" {
    /*!-----------------------------------------------------------
    * Copyright (c) IJS Technologies. All rights reserved.
    * Released under dual AGPLv3/commercial license
    * https://ijs.network
    *-----------------------------------------------------------*/
    import { IWallet, TransactionReceipt, Event } from "@ijstech/eth-wallet/wallet.ts";
    import { Contract } from "@ijstech/eth-wallet/contract.ts";
    import { BigNumber } from 'bignumber.js';
    export class Erc20 extends Contract {
        private _decimals;
        constructor(wallet: IWallet, address?: string, decimals?: number);
        deploy(params: {
            name: string;
            symbol: string;
            minter?: string;
            cap?: number | BigNumber;
        }): Promise<string>;
        parseApprovalEvent(receipt: TransactionReceipt): Erc20.ApprovalEvent[];
        decodeApprovalEvent(event: Event): Erc20.ApprovalEvent;
        parseTransferEvent(receipt: TransactionReceipt): Erc20.TransferEvent[];
        decodeTransferEvent(event: Event): Erc20.TransferEvent;
        allowance(params: {
            owner: string;
            spender: string;
        }): Promise<BigNumber>;
        approve(params: {
            spender: string;
            amount: number | BigNumber;
        }): Promise<any>;
        get balance(): Promise<BigNumber>;
        balanceOf(address: string): Promise<BigNumber>;
        get cap(): Promise<BigNumber>;
        get decimals(): Promise<number>;
        mint(params: {
            address: string;
            amount: number | BigNumber;
        }): Promise<any>;
        minter(): Promise<string>;
        get name(): Promise<string>;
        get symbol(): Promise<string>;
        get totalSupply(): Promise<BigNumber>;
        transfer(params: {
            address: string;
            amount: number | BigNumber;
        }): Promise<TransactionReceipt>;
    }
    export module Erc20 {
        interface ApprovalEvent {
            owner: string;
            spender: string;
            value: BigNumber;
            _event: Event;
        }
        interface TransferEvent {
            from: string;
            to: string;
            value: BigNumber;
            _event: Event;
        }
    }
}
/// <amd-module name="@ijstech/eth-wallet/eventBus.ts" />
declare module "@ijstech/eth-wallet/eventBus.ts" {
    export interface IEventBusRegistry {
        id: number;
        event: string;
        unregister: () => void;
    }
    export interface ICallable {
        [key: string]: Function;
    }
    export interface ISubscriber {
        [key: string]: ICallable;
    }
    export interface IEventBus {
        dispatch<T>(event: string, arg?: T): void;
        register(sender: any, event: string, callback: Function): IEventBusRegistry;
    }
    export class EventBus implements IEventBus {
        private subscribers;
        private static nextId;
        private static instance?;
        private idEventMap;
        private constructor();
        static getInstance(): EventBus;
        dispatch<T>(event: string, arg?: T): void;
        register(sender: any, event: string, callback: Function): IEventBusRegistry;
        unregister(id: number): void;
        private getNextId;
    }
}
/// <amd-module name="@ijstech/eth-wallet/providers.json.ts" />
declare module "@ijstech/eth-wallet/providers.json.ts" {
    const _default_4: {
        MetaMask: {
            displayName: string;
            image: string;
            homepage: string;
        };
        Web3Modal: {
            displayName: string;
            image: string;
        };
    };
    export default _default_4;
}
/// <amd-module name="@ijstech/eth-wallet/wallet.ts" />
declare module "@ijstech/eth-wallet/wallet.ts" {
    /*!-----------------------------------------------------------
    * Copyright (c) IJS Technologies. All rights reserved.
    * Released under dual AGPLv3/commercial license
    * https://ijs.network
    *-----------------------------------------------------------*/
    let Web3: any;
    import { IWeb3, ConfirmationObject, TransactionReceipt } from "@ijstech/eth-wallet/web3.ts";
    import { BigNumber } from 'bignumber.js';
    import { Erc20 } from "@ijstech/eth-wallet/contracts/erc20.ts";
    import { IAbiDefinition, MessageTypes, TypedMessage } from "@ijstech/eth-wallet/types.ts";
    import { IEventBusRegistry } from "@ijstech/eth-wallet/eventBus.ts";
    export { TransactionReceipt, ConfirmationObject };
    export function toString(value: any): any;
    export function stringToBytes32(value: string | stringArray): string | string[];
    export function stringToBytes(value: string | stringArray, nByte?: number): string | string[];
    export type stringArray = string | _stringArray;
    export interface _stringArray extends Array<stringArray> {
    }
    export interface IWalletUtils {
        fromDecimals(value: BigNumber | number | string, decimals?: number): BigNumber;
        fromWei(value: any, unit?: string): string;
        hexToUtf8(value: string): string;
        sha3(value: string): string;
        stringToBytes(value: string | stringArray, nByte?: number): string | string[];
        stringToBytes32(value: string | stringArray): string | string[];
        toDecimals(value: BigNumber | number | string, decimals?: number): BigNumber;
        toString(value: any): string;
        toUtf8(value: any): string;
        toWei(value: string, unit?: string): string;
    }
    export interface IWalletTransaction {
        hash: string;
        nonce: bigint;
        blockHash: string | null;
        blockNumber: bigint | null;
        transactionIndex: bigint | null;
        from: string;
        to: string | null;
        value: BigNumber;
        gasPrice: BigNumber;
        maxPriorityFeePerGas?: bigint | string | BigNumber;
        maxFeePerGas?: bigint | string | BigNumber;
        gas: bigint;
        input: string;
    }
    export interface IWalletBlockTransactionObject {
        number: bigint;
        hash: string;
        parentHash: string;
        nonce: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionRoot: string;
        stateRoot: string;
        receiptsRoot: string;
        miner: string;
        extraData: string;
        gasLimit: bigint;
        gasUsed: bigint;
        timestamp: bigint | string;
        baseFeePerGas?: bigint;
        size: bigint;
        difficulty: bigint;
        totalDifficulty: bigint;
        uncles: string[];
        transactions: IWalletTransaction[];
    }
    export interface ITokenInfo {
        name: string;
        symbol: string;
        totalSupply: BigNumber;
        decimals: number;
    }
    export interface IBatchRequestResult {
        key: string;
        result: any;
    }
    export interface IBatchRequestObj {
        batch: any;
        promises: Promise<IBatchRequestResult>[];
        execute: (batch: IBatchRequestObj, promises: Promise<IBatchRequestResult>[]) => Promise<IBatchRequestResult[]>;
    }
    export interface IConnectWalletEventPayload {
        userTriggeredConnect?: boolean;
        [key: string]: any;
    }
    export interface IWallet {
        account: IAccount;
        accounts: Promise<string[]>;
        address: string;
        balance: Promise<BigNumber>;
        balanceOf(address: string): Promise<BigNumber>;
        _call(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<any>;
        chainId: number;
        createAccount(): IAccount;
        decode(abi: any, event: Log | EventLog, raw?: {
            data: string;
            topics: string[];
        }): Event;
        decodeErrorMessage(msg: string): any;
        decodeEventData(data: Log, events?: any): Promise<Event>;
        decodeLog(inputs: any, hexString: string, topics: any): any;
        defaultAccount: string;
        getAbiEvents(abi: any[]): any;
        getAbiTopics(abi: any[], eventNames: string[]): any[];
        getBlock(blockHashOrBlockNumber?: number | string, returnTransactionObjects?: boolean): Promise<IWalletBlockTransactionObject>;
        getBlockNumber(): Promise<number>;
        getBlockTimestamp(blockHashOrBlockNumber?: number | string): Promise<number>;
        getChainId(): Promise<number>;
        getContractAbi(address: string): any;
        getContractAbiEvents(address: string): any;
        getTransaction(transactionHash: string): Promise<Transaction>;
        methods(...args: any): Promise<any>;
        privateKey: string;
        recoverSigner(msg: string, signature: string): Promise<string>;
        registerAbi(abi: any[] | string, address?: string | string[], handler?: any): string;
        registerAbiContracts(abiHash: string, address: string | string[], handler?: any): any;
        send(to: string, amount: number): Promise<TransactionReceipt>;
        _send(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<any>;
        scanEvents(fromBlock: number, toBlock?: number | string, topics?: any, events?: any, address?: string | string[]): Promise<Event[]>;
        scanEvents(params: {
            fromBlock: number;
            toBlock?: number | string;
            topics?: any;
            events?: any;
            address?: string | string[];
        }): Promise<Event[]>;
        signMessage(msg: string): Promise<string>;
        signTransaction(tx: any, privateKey?: string): Promise<string>;
        soliditySha3(...val: any[]): string;
        toChecksumAddress(address: string): string;
        isAddress(address: string): boolean;
        tokenInfo(address: string): Promise<ITokenInfo>;
        _txData(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<string>;
        _txObj(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<Transaction>;
        utils: IWalletUtils;
        verifyMessage(account: string, msg: string, signature: string): Promise<boolean>;
        multiCall(calls: {
            to: string;
            data: string;
        }[], gasBuffer?: string): Promise<{
            results: string[];
            lastSuccessIndex: BigNumber;
        }>;
        doMulticall(contracts: IMulticallContractCall[], gasBuffer?: string): Promise<any[]>;
        encodeFunctionCall<T extends IAbiDefinition, F extends Extract<keyof T, {
            [K in keyof T]: T[K] extends Function ? K : never;
        }[keyof T]>>(contract: T, methodName: F, params: string[]): string;
        decodeAbiEncodedParameters<T extends IAbiDefinition, F extends Extract<keyof T, {
            [K in keyof T]: T[K] extends Function ? K : never;
        }[keyof T]>>(contract: T, methodName: F, hexString: string): any;
    }
    export interface IClientWallet extends IWallet {
        init(): Promise<void>;
        blockGasLimit(): Promise<number>;
        clientSideProvider: IClientSideProvider;
        initClientWallet(config: IClientWalletConfig): void;
        connect(clientSideProvider: IClientSideProvider, eventPayload?: Record<string, any>): Promise<any>;
        disconnect(): Promise<void>;
        getGasPrice(): Promise<BigNumber>;
        getTransaction(transactionHash: string): Promise<Transaction>;
        getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
        isConnected: boolean;
        newContract(abi: any, address?: string): IContract;
        provider: any;
        registerEvent(abi: any, eventMap: {
            [topics: string]: any;
        }, address: string, handler: any): any;
        registerSendTxEvents(eventsOptions: ISendTxEventsOptions): void;
        sendSignedTransaction(signedTransaction: string): Promise<TransactionReceipt>;
        sendTransaction(transaction: Transaction): Promise<TransactionReceipt>;
        signTypedDataV4(data: TypedMessage<MessageTypes>): Promise<string>;
        switchNetwork(chainId: number): Promise<boolean>;
        transactionCount(): Promise<number>;
        getNetworkInfo(chainId: number): INetwork;
        setNetworkInfo(network: INetwork): void;
        setMultipleNetworksInfo(networks: INetwork[]): void;
        registerWalletEvent(sender: any, event: string, callback: Function): IEventBusRegistry;
        unregisterWalletEvent(registry: IEventBusRegistry): void;
        unregisterAllWalletEvents(): void;
        destoryRpcWalletInstance(instanceId: string): void;
        initRpcWallet(config: IRpcWalletConfig): string;
        encrypt: (key: string) => Promise<string>;
        decrypt: (data: string) => Promise<string>;
    }
    export interface IRpcWallet extends IWallet {
        init(): Promise<void>;
        instanceId: string;
        isConnected: boolean;
        switchNetwork(chainId: number): Promise<boolean>;
        registerWalletEvent(sender: any, event: string, callback: Function): IEventBusRegistry;
        unregisterAllWalletEvents(): void;
        unregisterWalletEvent(registry: IEventBusRegistry): void;
    }
    export interface IContractMethod {
        call: any;
        estimateGas(...params: any[]): Promise<bigint>;
        encodeABI(): string;
    }
    export interface IContract {
        deploy(params: {
            data: string;
            arguments?: any[];
        }): IContractMethod;
        methods: {
            [methodName: string]: (...params: any[]) => IContractMethod;
        };
        options: {
            address: string;
        };
    }
    export interface Event {
        name: string;
        address: string;
        blockNumber: bigint;
        logIndex: bigint;
        topics: string[];
        transactionHash: string;
        transactionIndex: bigint;
        data: any;
        rawData: any;
    }
    export interface Log {
        address: string;
        data: string;
        topics: Array<string>;
        logIndex: bigint;
        transactionHash?: string;
        transactionIndex: bigint;
        blockHash?: string;
        type?: string;
        blockNumber: bigint;
    }
    export interface EventLog {
        event: string;
        address: string;
        returnValues: any;
        logIndex: bigint;
        transactionIndex: bigint;
        transactionHash: string;
        blockHash: string;
        blockNumber: bigint;
        raw?: {
            data: string;
            topics: string[];
        };
    }
    export interface Transaction {
        from?: string;
        to?: string;
        nonce?: number;
        gas?: number;
        gasLimit?: number;
        gasPrice?: BigNumber | number;
        data?: string;
        value?: BigNumber | number;
    }
    export interface TransactionOptions {
        from?: string;
        to?: string;
        nonce?: number;
        gas?: number;
        gasLimit?: number;
        gasPrice?: string | BigNumber | number;
        data?: string;
        value?: BigNumber | number | string;
    }
    export interface IKMS {
    }
    export interface IAccount {
        address: string;
        privateKey?: string;
        kms?: IKMS;
        sign?(): Promise<string>;
        signTransaction?(): Promise<any>;
    }
    export interface ITokenOption {
        address: string;
        symbol: string;
        decimals: number;
        image?: string;
    }
    export interface INetwork {
        image?: string;
        chainId: number;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls?: string[];
        iconUrls?: string[];
    }
    export interface IClientSideProviderEvents {
        onAccountChanged?: (account: string) => void;
        onChainChanged?: (chainId: string) => void;
        onConnect?: (connectInfo: any) => void;
        onDisconnect?: (error: any) => void;
    }
    export interface IMulticallInfo {
        chainId: number;
        contractAddress: string;
        gasBuffer: string;
    }
    export type NetworksMapType = {
        [chainId: number]: INetwork;
    };
    export type MulticallInfoMapType = {
        [chainId: number]: IMulticallInfo;
    };
    export interface IMulticallContractCall {
        to: string;
        contract: IAbiDefinition;
        methodName: string;
        params: any[];
    }
    export interface IRpcWalletConfig {
        networks: INetwork[];
        defaultChainId?: number;
        infuraId: string;
        multicalls?: IMulticallInfo[];
    }
    export interface IClientWalletConfig {
        defaultChainId: number;
        networks: INetwork[];
        infuraId: string;
        multicalls?: IMulticallInfo[];
    }
    export interface IClientProviderOptions {
        name?: string;
        image?: string;
        infuraId?: string;
        useDefaultProvider?: boolean;
        [key: string]: any;
    }
    export interface IClientSideProvider {
        name: string;
        displayName: string;
        provider: any;
        selectedAddress: string;
        image: string;
        homepage?: string;
        events?: IClientSideProviderEvents;
        options?: IClientProviderOptions;
        installed(): boolean;
        isConnected(): boolean;
        connect: (eventPayload?: Record<string, any>) => Promise<void>;
        disconnect: () => Promise<void>;
        switchNetwork?: (chainId: number, onChainChanged?: (chainId: string) => void) => Promise<boolean>;
        encrypt: (key: string) => Promise<string>;
        decrypt: (data: string) => Promise<string>;
    }
    export class EthereumProvider implements IClientSideProvider {
        protected wallet: Wallet;
        protected _events?: IClientSideProviderEvents;
        protected _options?: IClientProviderOptions;
        protected _isConnected: boolean;
        protected _name: string;
        protected _image: string;
        protected _selectedAddress: string;
        onAccountChanged: (account: string) => void;
        onChainChanged: (chainId: string) => void;
        onConnect: (connectInfo: any) => void;
        onDisconnect: (error: any) => void;
        private handleAccountsChanged;
        private handleChainChanged;
        private handleConnect;
        private handleDisconnect;
        constructor(wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions);
        get name(): string;
        get displayName(): string;
        get provider(): any;
        get image(): string;
        installed(): boolean;
        get events(): IClientSideProviderEvents;
        get options(): IClientProviderOptions;
        get selectedAddress(): string;
        protected toChecksumAddress(address: string): string;
        protected removeListeners(): void;
        private _handleAccountsChanged;
        protected initEvents(): void;
        connect(eventPayload?: IConnectWalletEventPayload): Promise<any>;
        disconnect(): Promise<void>;
        isConnected(): boolean;
        addToken(option: ITokenOption, type?: string): Promise<boolean>;
        switchNetwork(chainId: number): Promise<boolean>;
        encrypt(key: string): Promise<string>;
        decrypt(data: string): Promise<string>;
    }
    export class MetaMaskProvider extends EthereumProvider {
        get displayName(): string;
        get image(): string;
        get homepage(): string;
        installed(): boolean;
        encrypt(key: string): Promise<string>;
        decrypt(data: string): Promise<string>;
    }
    export class Web3ModalProvider extends EthereumProvider {
        private _provider;
        constructor(wallet: Wallet, events?: IClientSideProviderEvents, options?: IClientProviderOptions);
        get name(): string;
        get displayName(): string;
        get provider(): any;
        get image(): string;
        get homepage(): any;
        installed(): boolean;
        get options(): IClientProviderOptions;
        private initializeWeb3Modal;
        connect(eventPayload?: IConnectWalletEventPayload): Promise<any>;
        disconnect(): Promise<void>;
    }
    export interface ISendTxEventsOptions {
        transactionHash?: (error: Error, receipt?: string) => void;
        confirmation?: (receipt: any) => void;
    }
    export class Wallet implements IClientWallet {
        protected _web3: IWeb3;
        protected _account: IAccount;
        private _accounts;
        protected _provider: any;
        private _eventTopicAbi;
        private _eventHandler;
        protected _sendTxEventHandler: ISendTxEventsOptions;
        protected _contracts: {};
        protected _blockGasLimit: number;
        private _networksMap;
        private _multicallInfoMap;
        chainId: number;
        clientSideProvider: IClientSideProvider;
        private _infuraId;
        protected _utils: IWalletUtils;
        private static _rpcWalletPoolMap;
        protected _walletEventIds: Set<number>;
        constructor(provider?: any, account?: IAccount | IAccount[]);
        private static readonly instance;
        static getInstance(): IWallet;
        static getClientInstance(): IClientWallet;
        static getRpcWalletInstance(instanceId: string): IRpcWallet;
        static initWeb3(): Promise<void>;
        init(): Promise<void>;
        get isConnected(): boolean;
        switchNetwork(chainId: number): Promise<any>;
        initClientWallet(config: IClientWalletConfig): void;
        registerWalletEvent(sender: any, event: string, callback: Function): IEventBusRegistry;
        unregisterWalletEvent(registry: IEventBusRegistry): void;
        unregisterAllWalletEvents(): void;
        destoryRpcWalletInstance(instanceId: string): void;
        private generateUUID;
        initRpcWallet(config: IRpcWalletConfig): string;
        setDefaultProvider(): void;
        connect(clientSideProvider: IClientSideProvider, eventPayload?: IConnectWalletEventPayload): Promise<void>;
        disconnect(): Promise<void>;
        encrypt(key: string): Promise<string>;
        decrypt(data: string): Promise<string>;
        get accounts(): Promise<string[]>;
        get address(): string;
        get account(): IAccount;
        set account(value: IAccount);
        get infuraId(): string;
        set infuraId(value: string);
        get networksMap(): NetworksMapType;
        get multicallInfoMap(): MulticallInfoMapType;
        set multicallInfoMap(value: MulticallInfoMapType);
        getNetworkInfo(chainId: number): INetwork;
        setNetworkInfo(network: INetwork): void;
        setMultipleNetworksInfo(networks: INetwork[]): void;
        createAccount(): IAccount;
        decodeLog(inputs: any, hexString: string, topics: any): any;
        get defaultAccount(): string;
        set defaultAccount(address: string);
        getChainId(): Promise<number>;
        get provider(): any;
        set provider(value: any);
        sendSignedTransaction(tx: string): Promise<TransactionReceipt>;
        signTransaction(tx: any, privateKey?: string): Promise<string>;
        registerSendTxEvents(eventsOptions: ISendTxEventsOptions): void;
        private getContract;
        _call(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<any>;
        private _getMethod;
        _txObj(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<Transaction>;
        _send(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<TransactionReceipt>;
        _txData(abiHash: string, address: string, methodName: string, params?: any[], options?: number | BigNumber | TransactionOptions): Promise<string>;
        _methods(...args: any[]): Promise<{
            to: any;
            data: any;
        }>;
        methods(...args: any): Promise<any>;
        get balance(): Promise<BigNumber>;
        balanceOf(address: string): Promise<BigNumber>;
        recoverSigner(msg: string, signature: string): Promise<string>;
        getBlock(blockHashOrBlockNumber?: number | string, returnTransactionObjects?: boolean): Promise<IWalletBlockTransactionObject>;
        getBlockNumber(): Promise<number>;
        getBlockTimestamp(blockHashOrBlockNumber?: number | string): Promise<number>;
        set privateKey(value: string);
        registerEvent(abi: any, eventMap: {
            [topics: string]: any;
        }, address: string, handler: any): Promise<void>;
        private _abiHashDict;
        private _abiContractDict;
        private _abiAddressDict;
        private _abiEventDict;
        getAbiEvents(abi: any[]): any;
        getAbiTopics(abi: any[], eventNames?: string[]): any[];
        getContractAbi(address: string): any;
        getContractAbiEvents(address: string): any;
        registerAbi(abi: any[] | string, address?: string | string[], handler?: any): string;
        registerAbiContracts(abiHash: string, address: string | string[], handler?: any): void;
        decode(abi: any, event: Log | EventLog, raw?: {
            data: string;
            topics: string[];
        }): Event;
        decodeEventData(data: Log, events?: any): Promise<Event>;
        scanEvents(params: {
            fromBlock: number;
            toBlock?: number | string;
            topics?: any;
            events?: any;
            address?: string | string[];
        }): Promise<Event[]>;
        scanEvents(fromBlock: number, toBlock?: number | string, topics?: any, events?: any, address?: string | string[]): Promise<Event[]>;
        send(to: string, amount: number | BigNumber): Promise<TransactionReceipt>;
        setBlockTime(time: number): Promise<any>;
        increaseBlockTime(value: number): Promise<any>;
        signMessage(msg: string): Promise<string>;
        signTypedDataV4(data: TypedMessage<MessageTypes>): Promise<string>;
        token(tokenAddress: string, decimals?: number): Erc20;
        tokenInfo(tokenAddress: string): Promise<ITokenInfo>;
        get utils(): IWalletUtils;
        verifyMessage(account: string, msg: string, signature: string): Promise<boolean>;
        private _gasLimit;
        blockGasLimit(): Promise<number>;
        getGasPrice(): Promise<BigNumber>;
        transactionCount(): Promise<number>;
        private monitorTransactionEvents;
        sendTransaction(transaction: TransactionOptions): Promise<TransactionReceipt>;
        getTransaction(transactionHash: string): Promise<Transaction>;
        getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
        call(transaction: Transaction): Promise<any>;
        newContract(abi: any, address?: string): IContract;
        decodeErrorMessage(msg: string): any;
        newBatchRequest(): Promise<IBatchRequestObj>;
        soliditySha3(...val: any[]): string;
        toChecksumAddress(address: string): string;
        isAddress(address: string): boolean;
        multiCall(calls: {
            to: string;
            data: string;
        }[], gasBuffer?: string): Promise<{
            results: string[];
            lastSuccessIndex: BigNumber;
        }>;
        doMulticall(contracts: IMulticallContractCall[], gasBuffer?: string): Promise<any[]>;
        encodeFunctionCall<T extends IAbiDefinition, F extends Extract<keyof T, {
            [K in keyof T]: T[K] extends Function ? K : never;
        }[keyof T]>>(contract: T, methodName: F, params: string[]): string;
        decodeAbiEncodedParameters<T extends IAbiDefinition, F extends Extract<keyof T, {
            [K in keyof T]: T[K] extends Function ? K : never;
        }[keyof T]>>(contract: T, methodName: F, hexString: string): {
            [key: string]: any;
        };
        get web3(): typeof Web3;
    }
    export class RpcWallet extends Wallet implements IRpcWallet {
        static rpcWalletRegistry: Record<string, IRpcWallet>;
        instanceId: string;
        private _address;
        get address(): string;
        set address(value: string);
        setProvider(provider: any): void;
        get isConnected(): boolean;
        static getRpcWallet(chainId: number): IRpcWallet;
        switchNetwork(chainId: number): Promise<any>;
        initWalletEvents(): void;
        registerWalletEvent(sender: any, event: string, callback: Function): IEventBusRegistry;
    }
}
/// <amd-module name="@ijstech/eth-wallet/approvalModel/ERC20ApprovalModel.ts" />
declare module "@ijstech/eth-wallet/approvalModel/ERC20ApprovalModel.ts" {
    import { BigNumber } from 'bignumber.js';
    import { IRpcWallet, TransactionReceipt } from "@ijstech/eth-wallet/wallet.ts";
    import { ITokenObject } from "@ijstech/eth-wallet/types.ts";
    export const getERC20Allowance: (wallet: IRpcWallet, token: ITokenObject, spenderAddress: string) => Promise<BigNumber>;
    export interface IERC20ApprovalEventOptions {
        sender: any;
        payAction: () => Promise<void>;
        onToBeApproved: (token: ITokenObject, data?: any) => Promise<void>;
        onToBePaid: (token: ITokenObject, data?: any) => Promise<void>;
        onApproving: (token: ITokenObject, receipt?: string, data?: any) => Promise<void>;
        onApproved: (token: ITokenObject, data?: any, receipt?: TransactionReceipt) => Promise<void>;
        onPaying: (receipt?: string, data?: any) => Promise<void>;
        onPaid: (data?: any, receipt?: TransactionReceipt) => Promise<void>;
        onApprovingError: (token: ITokenObject, err: Error) => Promise<void>;
        onPayingError: (err: Error) => Promise<void>;
    }
    export interface IERC20ApprovalOptions extends IERC20ApprovalEventOptions {
        spenderAddress: string;
    }
    export interface IERC20ApprovalAction {
        doApproveAction: (token: ITokenObject, inputAmount: string, data?: any) => Promise<void>;
        doPayAction: (data?: any) => Promise<void>;
        checkAllowance: (token: ITokenObject, inputAmount: string, data?: any) => Promise<void>;
    }
    export class ERC20ApprovalModel {
        private wallet;
        private options;
        constructor(wallet: IRpcWallet, options: IERC20ApprovalOptions);
        set spenderAddress(value: string);
        private checkAllowance;
        private doApproveAction;
        private doPayAction;
        getAction: () => IERC20ApprovalAction;
    }
}
/// <amd-module name="@ijstech/eth-wallet/approvalModel/index.ts" />
declare module "@ijstech/eth-wallet/approvalModel/index.ts" {
    export { getERC20Allowance, IERC20ApprovalEventOptions, IERC20ApprovalOptions, IERC20ApprovalAction, ERC20ApprovalModel } from "@ijstech/eth-wallet/approvalModel/ERC20ApprovalModel.ts";
}
/// <amd-module name="@ijstech/eth-wallet" />
declare module "@ijstech/eth-wallet" {
    /*!-----------------------------------------------------------
    * Copyright (c) IJS Technologies. All rights reserved.
    * Released under dual AGPLv3/commercial license
    * https://ijs.network
    *-----------------------------------------------------------*/
    export { IWallet, IWalletUtils, IAccount, Wallet, Transaction, Event, TransactionReceipt, ISendTxEventsOptions, IClientProviderOptions, IBatchRequestObj, INetwork, EthereumProvider, MetaMaskProvider, Web3ModalProvider, IClientSideProviderEvents, IClientSideProvider, IClientWalletConfig, IClientWallet, IMulticallInfo, RpcWallet, IRpcWalletConfig, IRpcWallet, IConnectWalletEventPayload, IMulticallContractCall } from "@ijstech/eth-wallet/wallet.ts";
    export { Contract } from "@ijstech/eth-wallet/contract.ts";
    export { BigNumber } from "bignumber.js";
    export { Erc20 } from "@ijstech/eth-wallet/contracts/erc20.ts";
    export * as Utils from "@ijstech/eth-wallet/utils.ts";
    export * as Contracts from "@ijstech/eth-wallet/contracts/index.ts";
    export * as Types from "@ijstech/eth-wallet/types.ts";
    export * as Constants from "@ijstech/eth-wallet/constants.ts";
    export { IEventBusRegistry, EventBus } from "@ijstech/eth-wallet/eventBus.ts";
    export { getERC20Allowance, IERC20ApprovalEventOptions, IERC20ApprovalOptions, IERC20ApprovalAction, ERC20ApprovalModel } from "@ijstech/eth-wallet/approvalModel/index.ts";
}
