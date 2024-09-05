/// <amd-module name="@scom/dapp/assets.ts" />
declare module "@scom/dapp/assets.ts" {
    type viewportType = "desktop" | "tablet" | "mobile";
    interface ILogo {
        header: string;
        footer: string;
    }
    interface IBreakpoints {
        mobile: number;
        tablet: number;
        desktop: number;
    }
    class Assets {
        private static _instance;
        private _breakpoints;
        static get instance(): Assets;
        get logo(): ILogo;
        set breakpoints(value: IBreakpoints);
        get breakpoints(): IBreakpoints;
        get viewport(): viewportType;
        private _getLogoPath;
        private _getLogo;
    }
    export const assets: Assets;
    function fullPath(path: string): string;
    const _default: {
        fonts: {
            poppins: {
                bold: string;
                italic: string;
                light: string;
                medium: string;
                regular: string;
                thin: string;
            };
        };
        img: {
            network: {
                bsc: string;
                eth: string;
                amio: string;
                avax: string;
                ftm: string;
                polygon: string;
            };
            wallet: {
                metamask: string;
                trustwallet: string;
                binanceChainWallet: string;
                walletconnect: string;
            };
        };
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/dapp/index.css.ts" />
declare module "@scom/dapp/index.css.ts" {
    const _default_1: string;
    export default _default_1;
}
/// <amd-module name="@scom/dapp/helper.ts" />
declare module "@scom/dapp/helper.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    export const formatDate: (date: any, customType?: string) => void;
    export const compareDate: (fromDate: any, toDate?: any) => void;
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const limitDecimals: (value: any, decimals: number) => any;
    export function getAPI(url: string, paramsObj?: any): Promise<any>;
    export const toWeiInv: (n: string, unit?: number) => BigNumber;
    export const abbreviateNum: (value: number) => string;
    export const getParamsFromUrl: () => URLSearchParams;
}
/// <amd-module name="@scom/dapp/walletList.ts" />
declare module "@scom/dapp/walletList.ts" {
    import { WalletPlugin } from '@ijstech/eth-wallet';
    export const walletList: ({
        name: WalletPlugin;
        displayName: string;
        img: string;
        iconFile?: undefined;
    } | {
        name: WalletPlugin;
        displayName: string;
        iconFile: string;
        img?: undefined;
    })[];
}
/// <amd-module name="@scom/dapp/wallet.ts" />
declare module "@scom/dapp/wallet.ts" {
    import { IWallet, WalletPlugin } from '@ijstech/eth-wallet';
    export interface IExtendedNetwork {
        chainId: number;
        name: string;
        img?: string;
        rpc?: string;
        symbol?: string;
        env?: string;
        explorerName?: string;
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
        isDisabled?: boolean;
    }
    export const enum EventId {
        ConnectWallet = "connectWallet",
        IsWalletConnected = "isWalletConnected",
        chainChanged = "chainChanged",
        IsWalletDisconnected = "IsWalletDisconnected"
    }
    export function isWalletConnected(): boolean;
    export function connectWallet(walletPlugin: WalletPlugin, eventHandlers?: {
        [key: string]: Function;
    }): Promise<IWallet>;
    export function switchNetwork(chainId: number): Promise<void>;
    export function logoutWallet(): Promise<void>;
    export const hasWallet: () => boolean;
    export const hasMetaMask: () => boolean;
    export const truncateAddress: (address: string) => string;
    export const getSupportedWalletProviders: () => ({
        name: WalletPlugin;
        displayName: string;
        img: string;
        iconFile?: undefined;
    } | {
        name: WalletPlugin;
        displayName: string;
        iconFile: string;
        img?: undefined;
    })[];
    export const updateWallets: (options: any) => void;
}
/// <amd-module name="@scom/dapp/network.ts" />
declare module "@scom/dapp/network.ts" {
    import { Erc20, Wallet, ISendTxEventsOptions } from '@ijstech/eth-wallet';
    import { formatDate, formatNumber } from "@scom/dapp/helper.ts";
    import { IExtendedNetwork, EventId } from "@scom/dapp/wallet.ts";
    export { isWalletConnected, hasWallet, hasMetaMask, truncateAddress, switchNetwork, connectWallet, logoutWallet } from "@scom/dapp/wallet.ts";
    export { IExtendedNetwork, EventId, formatDate, formatNumber };
    export interface ITokenObject {
        address?: string;
        name: string;
        decimals: number;
        symbol: string;
        status?: boolean | null;
        logoURI?: string;
        isCommon?: boolean | null;
        balance?: string | number;
        isNative?: boolean | null;
    }
    export const updateNetworks: (options: any) => void;
    export function registerSendTxEvents(sendTxEventHandlers: ISendTxEventsOptions): void;
    export function getChainId(): number;
    export function getWallet(): Wallet;
    export function getWalletProvider(): string;
    export function getErc20(address: string): Erc20;
    export const getNetworkInfo: (chainId: number) => IExtendedNetwork | undefined;
    export const getNetworkList: () => IExtendedNetwork[];
    export const viewOnExplorerByTxHash: (chainId: number, txHash: string) => void;
    export const viewOnExplorerByAddress: (chainId: number, address: string) => void;
    export const getNetworkType: (chainId: number) => string;
    export const getDefaultChainId: () => number;
    export const getSiteSupportedNetworks: () => IExtendedNetwork[];
    export const isValidEnv: (env: string) => boolean;
    export const getInfuraId: () => string;
    export const getEnv: () => string;
    export const isDefaultNetworkFromWallet: () => boolean;
}
/// <amd-module name="@scom/dapp/header.css.ts" />
declare module "@scom/dapp/header.css.ts" {
    const _default_2: string;
    export default _default_2;
}
/// <amd-module name="@scom/dapp/pathToRegexp.ts" />
declare module "@scom/dapp/pathToRegexp.ts" {
    export interface ParseOptions {
        /**
         * Set the default delimiter for repeat parameters. (default: `'/'`)
         */
        delimiter?: string;
        /**
         * List of characters to automatically consider prefixes when parsing.
         */
        prefixes?: string;
    }
    /**
     * Parse a string for the raw tokens.
     */
    export function parse(str: string, options?: ParseOptions): Token[];
    export interface TokensToFunctionOptions {
        /**
         * When `true` the regexp will be case sensitive. (default: `false`)
         */
        sensitive?: boolean;
        /**
         * Function for encoding input strings for output.
         */
        encode?: (value: string, token: Key) => string;
        /**
         * When `false` the function can produce an invalid (unmatched) path. (default: `true`)
         */
        validate?: boolean;
    }
    /**
     * Compile a string to a template function for the path.
     */
    export function compile<P extends object = object>(str: string, options?: ParseOptions & TokensToFunctionOptions): PathFunction<P>;
    export type PathFunction<P extends object = object> = (data?: P) => string;
    /**
     * Expose a method for transforming tokens into the path function.
     */
    export function tokensToFunction<P extends object = object>(tokens: Token[], options?: TokensToFunctionOptions): PathFunction<P>;
    export interface RegexpToFunctionOptions {
        /**
         * Function for decoding strings for params.
         */
        decode?: (value: string, token: Key) => string;
    }
    /**
     * A match result contains data about the path match.
     */
    export interface MatchResult<P extends object = object> {
        path: string;
        index: number;
        params: P;
    }
    /**
     * A match is either `false` (no match) or a match result.
     */
    export type Match<P extends object = object> = false | MatchResult<P>;
    /**
     * The match function takes a string and returns whether it matched the path.
     */
    export type MatchFunction<P extends object = object> = (path: string) => Match<P>;
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    export function match<P extends object = object>(str: Path, options?: ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions): MatchFunction<P>;
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    export function regexpToFunction<P extends object = object>(re: RegExp, keys: Key[], options?: RegexpToFunctionOptions): MatchFunction<P>;
    /**
     * Metadata about a key.
     */
    export interface Key {
        name: string | number;
        prefix: string;
        suffix: string;
        pattern: string;
        modifier: string;
    }
    /**
     * A token is a string (nothing special) or key metadata (capture group).
     */
    export type Token = string | Key;
    export interface TokensToRegexpOptions {
        /**
         * When `true` the regexp will be case sensitive. (default: `false`)
         */
        sensitive?: boolean;
        /**
         * When `true` the regexp won't allow an optional trailing delimiter to match. (default: `false`)
         */
        strict?: boolean;
        /**
         * When `true` the regexp will match to the end of the string. (default: `true`)
         */
        end?: boolean;
        /**
         * When `true` the regexp will match from the beginning of the string. (default: `true`)
         */
        start?: boolean;
        /**
         * Sets the final character for non-ending optimistic matches. (default: `/`)
         */
        delimiter?: string;
        /**
         * List of characters that can also be "end" characters.
         */
        endsWith?: string;
        /**
         * Encode path tokens for use in the `RegExp`.
         */
        encode?: (value: string) => string;
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    export function tokensToRegexp(tokens: Token[], keys?: Key[], options?: TokensToRegexpOptions): RegExp;
    /**
     * Supported `path-to-regexp` input types.
     */
    export type Path = string | RegExp | Array<string | RegExp>;
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    export function pathToRegexp(path: Path, keys?: Key[], options?: TokensToRegexpOptions & ParseOptions): RegExp;
}
/// <amd-module name="@scom/dapp/header.tsx" />
declare module "@scom/dapp/header.tsx" {
    import { Module, Control, ControlElement, Container, IMenuItem } from '@ijstech/components';
    import { WalletPlugin } from "@ijstech/eth-wallet";
    interface IModuleMenu {
        caption?: string;
        module?: string;
        url?: string;
        params?: any;
        env?: string;
        networks?: number[];
        isToExternal?: boolean;
        img?: string;
        menus?: IModuleMenu[];
        isDisabled?: boolean;
    }
    interface ILogo {
        desktop?: string;
        mobile?: string;
    }
    export interface HeaderElement extends ControlElement {
        logo?: ILogo;
        menuItems?: IModuleMenu[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["main-header"]: HeaderElement;
            }
        }
    }
    export class Header extends Module {
        private hsMobileMenu;
        private hsDesktopMenu;
        private mdMobileMenu;
        private menuMobile;
        private menuDesktop;
        private btnNetwork;
        private hsBalance;
        private lblBalance;
        private pnlWalletDetail;
        private btnWalletDetail;
        private mdWalletDetail;
        private btnConnectWallet;
        private mdNetwork;
        private mdConnect;
        private mdAccount;
        private lblNetworkDesc;
        private lblWalletAddress;
        private hsViewAccount;
        private gridWalletList;
        private gridNetworkGroup;
        private $eventBus;
        private selectedNetwork;
        private _menuItems;
        private networkMapper;
        private walletMapper;
        private currActiveNetworkId;
        private currActiveWallet;
        private imgDesktopLogo;
        private imgMobileLogo;
        private supportedNetworks;
        private walletInfo;
        constructor(parent?: Container, options?: any);
        get symbol(): string;
        get shortlyAddress(): string;
        registerEvent(): void;
        init(): void;
        connectedCallback(): void;
        disconnectCallback(): void;
        controlMenuDisplay(): void;
        onChainChanged: (chainId: number) => Promise<void>;
        updateConnectedStatus: (isConnected: boolean) => void;
        updateDot(connected: boolean, type: 'network' | 'wallet'): void;
        updateList(isConnected: boolean): void;
        openConnectModal: () => void;
        openNetworkModal: () => void;
        openWalletDetailModal: () => void;
        openAccountModal: (target: Control, event: Event) => void;
        openSwitchModal: (target: Control, event: Event) => void;
        logout: (target: Control, event: Event) => Promise<void>;
        viewOnExplorerByAddress(): void;
        switchNetwork(chainId: number): Promise<void>;
        connectToProviderFunc: (walletPlugin: WalletPlugin) => Promise<void>;
        copyWalletAddress: () => void;
        isWalletActive(walletPlugin: any): boolean;
        isNetworkActive(chainId: number): boolean;
        renderWalletList: () => void;
        renderNetworks(): void;
        initData(): Promise<void>;
        getMenuPath(url: string, params: any): string;
        _getMenuData(list: IModuleMenu[], mode: string, validMenuItemsFn: (item: IModuleMenu) => boolean): IMenuItem[];
        getMenuData(list: IModuleMenu[], mode: string): any;
        renderMobileMenu(): void;
        renderDesktopMenu(): void;
        toggleMenu(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/dapp/footer.css.ts" />
declare module "@scom/dapp/footer.css.ts" {
    export const logoStyle: string;
}
/// <amd-module name="@scom/dapp/footer.tsx" />
declare module "@scom/dapp/footer.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    export interface FooterElement extends ControlElement {
        logo?: string;
        copyrightInfo?: string;
        version?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["main-footer"]: FooterElement;
            }
        }
    }
    export class Footer extends Module {
        private imgLogo;
        private lblCopyright;
        private lblVersion;
        init(): void;
        connectedCallback(): void;
        disconnectCallback(): void;
        updateLogo(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/dapp" />
declare module "@scom/dapp" {
    import { Module, Styles, Container } from '@ijstech/components';
    export { Header } from "@scom/dapp/header.tsx";
    export { Footer } from "@scom/dapp/footer.tsx";
    interface ITheme {
        default: string;
        dark?: Styles.Theme.ITheme;
        light?: Styles.Theme.ITheme;
    }
    export default class MainLauncher extends Module {
        private pnlMain;
        private menuItems;
        private _options;
        private currentModule;
        private headerElm;
        private footerElm;
        private pnlScrollable;
        constructor(parent?: Container, options?: any);
        init(): Promise<void>;
        hideCurrentModule(): void;
        getModuleByPath(path: string): Promise<{
            module: Module;
            params?: any;
        }>;
        handleHashChange(): Promise<void>;
        mergeTheme: (target: Styles.Theme.ITheme, theme: Styles.Theme.ITheme) => Styles.Theme.ITheme;
        updateThemes(themes?: ITheme): void;
        updateLayout(): void;
        render(): Promise<any>;
    }
}
