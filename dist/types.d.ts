export interface IWalletConfig {
    name: string;
    supportedBlockchains: Array<Blockchain>;
    instanceKey: string;
}
export interface IAccount {
    address: string;
    networkId: string;
}
export interface IBlockchainProvider {
    autoRefreshOnNetworkChange: string;
    selectedAccount: IAccount;
    getAccounts(): any;
    addEventListener(eventName: string, callback: any): any;
}
export interface IWallet {
    blockchains: Map<Blockchain, IBlockchainProvider>;
}
export declare enum MessageType {
    WALLET_READY = "walletReady",
    WALLET_SCRIPT_INJECTED = "scriptInjected",
    WALLET_GRANT_PERMISSION_RESPONSE = "grantPermissionResponse",
    WALLET_GRANT_PERMISSION_REQUEST = "grantPermissionRequest"
}
export declare enum Blockchain {
    zilliqa = "zilliqa",
    ethereum = "ethereum"
}
