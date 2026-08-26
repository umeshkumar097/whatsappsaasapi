import fs from 'fs';

const serverFile = 'server/controllers/wallet.controller.ts';
let serverCode = fs.readFileSync(serverFile, 'utf8');

serverCode = serverCode.replace(
  'payment_link: response.data.payment_link',
  'isLive: isLive'
);
fs.writeFileSync(serverFile, serverCode);


const clientFile = 'client/src/pages/Wallet.tsx';
let clientCode = fs.readFileSync(clientFile, 'utf8');

clientCode = clientCode.replace(
  /if \(data\.payment_link\) \{[\s\S]*?window\.location\.href = data\.payment_link;[\s\S]*?\} else \{/,
  'if (data.payment_session_id) {\n        const script = document.createElement("script");\n        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";\n        script.onload = () => {\n          const cashfree = (window as any).Cashfree({\n            mode: data.isLive ? "production" : "sandbox", \n          });\n          cashfree.checkout({\n            paymentSessionId: data.payment_session_id,\n            redirectTarget: "_self"\n          });\n        };\n        document.body.appendChild(script);\n      } else {'
);
fs.writeFileSync(clientFile, clientCode);

