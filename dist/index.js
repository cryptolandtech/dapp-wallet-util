var e,t;!function(e){e.WALLET_READY="walletReady",e.WALLET_SCRIPT_INJECTED="scriptInjected",e.WALLET_GRANT_PERMISSION_RESPONSE="grantPermissionResponse",e.WALLET_GRANT_PERMISSION_REQUEST="grantPermissionRequest"}(e||(e={})),function(e){e.zilliqa="zilliqa",e.ethereum="ethereum"}(t||(t={}));var n,r,o={moonlet:{name:"Moonlet Wallet",supportedBlockchains:[t.zilliqa],instanceKey:"moonlet"}},i=function(e,t){var n=function(n){if(n.data.type===e&&"function"==typeof t)return t(n.data,n)};return window.addEventListener("message",n),function(){window.removeEventListener("message",n)}},a="https://cryptolandtech.github.io/dapp-wallet-util/",s=!1,u=0,c=[];i(e.WALLET_READY,function(e){e.walletId&&c.push(e.walletId)});var l=function(e){return void 0===e&&(e=!1),s?r:!n||e?(s=!0,r=new Promise(function(e){var t="wallet-bridge-iframe-"+Math.random().toString().substr(2),r=document.createElement("iframe");r.width="0",r.height="0",r.frameBorder="0",r.id=t,r.src=a,r.onload=function(){u=Date.now(),n=r,s=!1,e(r)},c=[],document.body.appendChild(r)})):Promise.resolve(n)},d=function(e){var t=c.map(function(e){return o[e]}).filter(Boolean);return e&&(t=t.filter(function(t){return t.supportedBlockchains.includes(e)})),t},E=function(e,t){void 0===t&&(t=3e3);try{return Promise.resolve(l()).then(function(){return u+t<=Date.now()?Promise.resolve(d(e)):new Promise(function(n){setTimeout(function(){n(d(e))},t)})})}catch(e){return Promise.reject(e)}},f=function(e){var t,n=o[e];return n&&window[n.instanceKey]&&(t=window[o[e].instanceKey]),t},w={sendWalletReadyEvent:function(t){window.parent.postMessage({type:e.WALLET_READY,walletId:t},"*")},sendScriptInjectedEvent:function(t,n){window.parent.postMessage({type:e.WALLET_SCRIPT_INJECTED,walletId:t},n||document.location.href)},onGrantPermissionRequest:function(t,n){if("function"!=typeof n)throw new Error("Callback should be a function.");return i(e.WALLET_GRANT_PERMISSION_REQUEST,function(e,r){e.walletId===t&&n(e,r)})},sendGrantPermissionResponse:function(t,n,r){window.parent.postMessage({type:e.WALLET_GRANT_PERMISSION_RESPONSE,walletId:t,response:n},r||"*")}};exports.dapp={getWallets:E,getWalletInstance:function(t){try{if(!t)throw new Error("This feature is not yet supported...");if(t){if(o[t]){var n=f(t);return n?Promise.resolve(n):Promise.resolve(E()).then(function(){return c.indexOf(t)>=0?new Promise(function(n,r){try{return Promise.resolve(function(t){return new Promise(function(n){try{return Promise.resolve(l(!0)).then(function(r){r.contentWindow.postMessage({type:e.WALLET_GRANT_PERMISSION_REQUEST,walletId:t},a);var o=i(e.WALLET_GRANT_PERMISSION_RESPONSE,function(e){e.walletId&&e.walletId===t&&(clearTimeout(s),o(),n(!!e.response))}),s=setTimeout(function(){o(),n(!1)},3e4)})}catch(e){return Promise.reject(e)}})}(t)).then(function(a){a?n(function(t){var n=f(t);return n?Promise.resolve(n):new Promise(function(n,r){var a=i(e.WALLET_SCRIPT_INJECTED,function(e){if(e.walletId&&e.walletId===t){if(a(),clearTimeout(s),window[o[t].instanceKey])return n(window[o[t].instanceKey]);r("WALLET_INSTANCE_NOT_FOUND")}}),s=setTimeout(function(){a(),r("WALLET_SCRIPT_INJECT_TIMEOUT")},1e4)})}(t)):r("USER_DID_NOT_GRANT_PERMISSION")})}catch(e){return Promise.reject(e)}}):Promise.reject("WALLET_NOT_INSTALLED")})}return console.warn("Wallet with id: #{walletId} is not in whitelist. If you are a new wallet make a PR here: https://github.com/cryptolandtech/dapp-wallet-util"),Promise.reject("WALLET_ID_NOT_IN_WHITELIST")}return Promise.reject("WALLET_ID_NOT_PROVIDED")}catch(e){return Promise.reject(e)}}},exports.wallet=w;
//# sourceMappingURL=index.js.map
