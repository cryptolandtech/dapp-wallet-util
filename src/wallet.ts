import { MessageType } from "./types";
import { onMessage } from "./utils";

export const sendWalletReadyEvent = (walletId) => {
    window.parent.postMessage({
        type: MessageType.WALLET_READY,
        walletId
    }, '*');
}

export const sendScriptInjectedEvent = (walletId, target?) => {
    window.parent.postMessage({
        type: MessageType.WALLET_SCRIPT_INJECTED,
        walletId
    }, target || document.location.href);
}

export const onGrantPermissionRequest = (walletId: string, callback: (data: any, ev?:MessageEvent) => void): () => any => {
    if (typeof callback !== 'function') {
        throw new Error('Callback should be a function.');
    }

    return onMessage(MessageType.WALLET_GRANT_PERMISSION_REQUEST, (data, ev: MessageEvent) => {
        if (data.walletId === walletId) {
            callback(data, ev);
        }
    }); 
}

export const sendGrantPermissionResponse = (walletId: string, response: boolean, target?: string) => {
    window.parent.postMessage({
        type: MessageType.WALLET_GRANT_PERMISSION_RESPONSE,
        walletId,
        response
    }, target || '*');
}