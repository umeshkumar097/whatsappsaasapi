import fs from 'fs';

const file = 'client/src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import Wallet from "./pages/Wallet";')) {
  code = code.replace(
    'import Settings from "@/pages/settings";',
    'import Settings from "@/pages/settings";\nimport Wallet from "./pages/Wallet";'
  );
}

if (!code.includes('"/wallet": ""')) {
  code = code.replace(
    '"/billing": "",',
    '"/billing": "",\n  "/wallet": "",'
  );
}

if (!code.includes('<Route path="/wallet">')) {
  code = code.replace(
    '<Route path="/billing">',
    '<Route path="/billing">\n            <PermissionRoute component={BillingSubscriptionPage} />\n          </Route>\n          <Route path="/wallet">\n            <PermissionRoute component={Wallet} />\n          </Route>\n          <Route path="/dummy-billing-to-replace">'
  );
  code = code.replace(
    /<Route path="\/dummy-billing-to-replace">[\s\S]*?<\/Route>/,
    ""
  );
}

fs.writeFileSync(file, code);
console.log("App patched");
