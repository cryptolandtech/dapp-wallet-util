import { IWalletConfig, IWallet, Blockchain } from "./types";
export declare const getWallets: (blockchain?: Blockchain, timeout?: number) => Promise<IWalletConfig[]>;
export declare const getWalletInstance: (walletId?: string) => Promise<IWallet>;
