/// <amd-module name="@scom/scom-network-list" />
declare module "@scom/scom-network-list" {
    import { INetwork } from "@ijstech/eth-wallet";
    export default function getNetworkList(): INetwork[];
    export { getNetworkList };
}
