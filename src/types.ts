export interface IWalletConfig {
    name: string,
    supportedBlockchains: Array<Blockchain>;
    instanceKey: string
}

export interface IAccount {
    address: string;
    networkId: string;
}

export interface IBlockchainProvider {
    autoRefreshOnNetworkChange: string;
    selectedAccount: IAccount; 

    getAccounts();
    addEventListener(eventName: string, callback);
}

export interface IWallet {
    blockchains: Map<Blockchain, IBlockchainProvider>;
}

export enum MessageType {
    WALLET_READY = 'walletReady',
    WALLET_SCRIPT_INJECTED = 'scriptInjected',
    WALLET_GRANT_PERMISSION_RESPONSE = 'grantPermissionResponse',
    WALLET_GRANT_PERMISSION_REQUEST = 'grantPermissionRequest'
}

export enum Blockchain {
    zilliqa = 'zilliqa',
    ethereum = 'ethereum'
}