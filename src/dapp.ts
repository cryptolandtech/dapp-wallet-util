import { IWalletConfig, IWallet, MessageType, Blockchain } from "./types";
import { walletsWhitelist } from "./wallet-whitelist";
import { onMessage } from "./utils";

const BRIDGE_URL = 'https://cryptolandtech.github.io/dapp-wallet-util/';

let iframe: HTMLIFrameElement;
let iframeLoadInProgress: boolean = false;
let iframeLoadTimestamp: number = 0;
let iframePromise: Promise<HTMLIFrameElement>;
let walletList: Array<string> = [];

onMessage(MessageType.WALLET_READY, (data) => {
    if (data.walletId) {
        walletList.push(data.walletId);
    }
});

const getIframe = (forceReLoad: boolean = false): Promise<HTMLIFrameElement> => {
    if (iframeLoadInProgress) {
        // iframe loading in progress
        return iframePromise;
    } else {
        if (!iframe || forceReLoad) {
            // iframe not loaded or requested force reload
            iframeLoadInProgress = true;
            iframePromise = new Promise((resolve) => {
                const id = 'wallet-bridge-iframe-' + Math.random().toString().substr(2);
                const i = document.createElement('iframe');
                i.width = "0";
                i.height = "0";
                i.frameBorder = "0";
                i.id = id;
                i.src = BRIDGE_URL;
    
                // TODO implement timeout
                i.onload = () => {
                    iframeLoadTimestamp = Date.now();
                    iframe = i;
                    iframeLoadInProgress = false;
                    resolve(i);
                }
                
                walletList = [];
                document.body.appendChild(i);
            });
            return iframePromise;
        } else {
            return Promise.resolve(iframe);
        }
    }
}

const getWalletsList = (blockchain: Blockchain) => {
    let wallets =  walletList
        .map(id => walletsWhitelist[id])
        .filter(Boolean)
        
    if (blockchain) {
        wallets = wallets.filter(wallet => wallet.supportedBlockchains.includes(blockchain));
    }

    return wallets;
}

export const getWallets = async (blockchain?: Blockchain, timeout: number = 3000): Promise<Array<IWalletConfig>> => {
    await getIframe();

    // if timeout already passes return wallets list
    if (iframeLoadTimestamp + timeout <= Date.now()) {
        return Promise.resolve(getWalletsList(blockchain));
    }

    // wait for timeout then return wallets list
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getWalletsList(blockchain));
        }, timeout);
    });
}

const getInjectedWalletInstance = (walletId: string) => {
    let instance;
    const wallet = walletsWhitelist[walletId];
    if (wallet && (window as any)[wallet.instanceKey]) {
        instance = (window as any)[walletsWhitelist[walletId].instanceKey];
    }
    return instance;
}

export const getWalletInstance = async (walletId?: string): Promise<IWallet> => {
    if (!walletId) {
        // TODO: wallet id not set, search in local storage for a used wallet
        throw new Error('This feature is not yet supported...');
    }

    if (walletId) {
        const wallet = walletsWhitelist[walletId];
        if (wallet) {
            const walletInstance = getInjectedWalletInstance(walletId);
            if (walletInstance) {
                // wallet extension has already access to the page
                return Promise.resolve(walletInstance);
            } else {
                // check that wallet is installed
                await getWallets();
                if (walletList.indexOf(walletId) >= 0) {
                    // wallet extension doesn't have access to the page
                    // trigger a grant access request
                    return new Promise(async (resolve, reject) => {
                        if (await requestPermission(walletId as string)) {
                            resolve(getWalletInstanceAfterIsInjected(walletId as string));
                        } else {
                            reject('USER_DID_NOT_GRANT_PERMISSION');
                        }
                    });
                } else {
                    return Promise.reject('WALLET_NOT_INSTALLED');
                }
                
            }
        } else {
            // wallet not recognized
            // show a warning
            console.warn(`Wallet with id: #{walletId} is not in whitelist. If you are a new wallet make a PR here: https://github.com/cryptolandtech/dapp-wallet-util`);
            return Promise.reject('WALLET_ID_NOT_IN_WHITELIST');
        }
    } else {
        return Promise.reject('WALLET_ID_NOT_PROVIDED');
    }
}

const requestPermission = (walletId: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
        (await getIframe(true) as any).contentWindow.postMessage({type: MessageType.WALLET_GRANT_PERMISSION_REQUEST, walletId}, BRIDGE_URL);
        let unsub = onMessage(MessageType.WALLET_GRANT_PERMISSION_RESPONSE, (data) => {
            if (data.walletId && data.walletId === walletId) {
                clearTimeout(timeout);
                unsub();
                resolve(!!data.response);
            }
        });

        let timeout = setTimeout(() => {
            unsub();
            resolve(false);
        }, 30000);
    });
}

const getWalletInstanceAfterIsInjected = (walletId: string): Promise<any> => {
    const walletInstance = getInjectedWalletInstance(walletId);
    if (walletInstance) {
        // wallet extension has already access to the page
        return Promise.resolve(walletInstance);
    }

    return new Promise((resolve, reject) => {
        const unsub = onMessage(MessageType.WALLET_SCRIPT_INJECTED, (data) => {
            if (data.walletId && data.walletId === walletId) {
                unsub();
                clearTimeout(timeout);
                if ((window as any)[walletsWhitelist[walletId].instanceKey]) {
                    return resolve((window as any)[walletsWhitelist[walletId].instanceKey]);
                } else {
                    reject('WALLET_INSTANCE_NOT_FOUND');
                }
            }
        });

        const timeout = setTimeout(() => {
            unsub();
            reject('WALLET_SCRIPT_INJECT_TIMEOUT');
        }, 10000);
    });
}

// trigger iframe preload
// getIframe();