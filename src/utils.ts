export const onMessage = (type: string, callback: (data: any, ev?: MessageEvent) => any): () => any => {
    const listener = (ev: MessageEvent) => {
        if (ev.data.type === type && typeof callback === 'function') {
            return callback(ev.data, ev);
        }
    };

    window.addEventListener('message', listener);
    return () => {
        window.removeEventListener('message', listener);
    }
}