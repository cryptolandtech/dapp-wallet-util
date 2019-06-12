export declare const sendWalletReadyEvent: (walletId: any) => void;
export declare const sendScriptInjectedEvent: (walletId: any, target?: any) => void;
export declare const onGrantPermissionRequest: (walletId: string, callback: (data: any, ev?: MessageEvent) => void) => () => any;
export declare const sendGrantPermissionResponse: (walletId: string, response: boolean, target?: string) => void;
