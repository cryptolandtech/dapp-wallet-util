import { IWalletConfig, Blockchain } from "./types";

export const walletsWhitelist: {[id: string]: IWalletConfig} = {
    moonlet: {
        name: 'Moonlet Wallet',
        supportedBlockchains: [Blockchain.zilliqa], 
        instanceKey: 'moonlet'
    }
}